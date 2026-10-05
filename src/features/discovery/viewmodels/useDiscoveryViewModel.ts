import { create } from 'zustand';
import * as Location from 'expo-location';
import { Doctor } from '../domain/entities/Doctor';
import { doctorRepository } from '../data/doctorRepository';
import { Place } from '../data/datasources/NominatimGeocoder';

const FALLBACK_LOCATION = { latitude: 28.4595, longitude: 77.0266, city: 'Gurugram, HR' };

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface FilterState {
  specialty: string | null; // null = all
  radiusKm: number;
  openNow: boolean;
}

export const RADIUS_OPTIONS_KM = [2, 5, 10];

const DEFAULT_FILTERS: FilterState = { specialty: null, radiusKm: 5, openNow: false };

export const applyFilters = (doctors: Doctor[], filters: FilterState): Doctor[] =>
  doctors.filter(d =>
    (!filters.specialty || d.specialty === filters.specialty) &&
    (!filters.openNow || d.isOpenNow === true) &&
    d.distance <= filters.radiusKm
  );

let latestRequestId = 0;

// Where doctors are searched around: the searched place if any, else GPS, else fallback
export const getSearchCenter = (state: Pick<DiscoveryViewModel, 'searchLocation' | 'userLocation'>) => {
  if (state.searchLocation) {
    const { latitude, longitude, label } = state.searchLocation;
    return { latitude, longitude, city: label };
  }
  const { latitude, longitude, city } = state.userLocation;
  if (latitude != null && longitude != null) {
    return { latitude, longitude, city: city ?? 'Your Location' };
  }
  return FALLBACK_LOCATION;
};

interface DiscoveryViewModel {
  // State
  doctors: Doctor[];
  isLoadingDoctors: boolean;
  doctorsError: string | null;
  selectedDoctorId: string | null;
  userLocation: LocationState;
  // A place picked by search (e.g. a parent's city); null = use GPS location
  searchLocation: Place | null;
  filters: FilterState;

  // Actions
  loadLocation: () => Promise<void>;
  loadDoctors: () => Promise<void>;
  setSearchLocation: (place: Place | null) => void;
  setSelectedDoctor: (id: string | null) => void;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

export const useDiscoveryViewModel = create<DiscoveryViewModel>((set, get) => ({
  doctors: [],
  isLoadingDoctors: true,
  doctorsError: null,
  selectedDoctorId: null,
  userLocation: {
    latitude: null,
    longitude: null,
    city: null,
    isLoading: true,
    error: null,
  },
  searchLocation: null,
  filters: DEFAULT_FILTERS,

  loadLocation: async () => {
    set((state) => ({ userLocation: { ...state.userLocation, isLoading: true, error: null } }));
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ userLocation: { latitude: null, longitude: null, city: 'Access Denied', isLoading: false, error: 'Permission denied' } });
        get().loadDoctors(); // load anyway
        return;
      }

      let location = await Location.getLastKnownPositionAsync();
      if (!location || Date.now() - location.timestamp > 1000 * 60 * 15) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }
      
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const city = reverseGeocode[0]?.city || reverseGeocode[0]?.subregion || 'Your Location';

      set({
        userLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          city: city,
          isLoading: false,
          error: null,
        }
      });
      get().loadDoctors();
    } catch (error) {
      console.warn("Location error, falling back to default:", error);
      // Fallback
      set({
        userLocation: {
          ...FALLBACK_LOCATION,
          isLoading: false,
          error: null,
        }
      });
      get().loadDoctors();
    }
  },

  loadDoctors: async () => {
    const requestId = ++latestRequestId;
    set({ isLoadingDoctors: true, doctorsError: null });
    const center = getSearchCenter(get());
    try {
      const data = await doctorRepository.getNearby({
        ...center,
        radiusMeters: get().filters.radiusKm * 1000,
      });
      // Ignore responses for a location the user has since moved away from
      if (requestId !== latestRequestId) return;
      set({ doctors: data, isLoadingDoctors: false });
    } catch (e) {
      if (requestId !== latestRequestId) return;
      console.warn('Failed to load doctors:', e);
      set({ isLoadingDoctors: false, doctorsError: 'Could not load nearby doctors' });
    }
  },

  setSearchLocation: (place) => {
    set({ searchLocation: place, selectedDoctorId: null, doctors: [] });
    get().loadDoctors();
  },

  setSelectedDoctor: (id) => set({ selectedDoctorId: id }),

  updateFilters: (newFilters) => {
    const prevRadius = get().filters.radiusKm;
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    // Specialty / open-now filter client-side; a wider radius needs a fresh query
    if (get().filters.radiusKm > prevRadius) get().loadDoctors();
  },

  resetFilters: () => {
    const prevRadius = get().filters.radiusKm;
    set({ filters: DEFAULT_FILTERS });
    if (DEFAULT_FILTERS.radiusKm > prevRadius) get().loadDoctors();
  }
}));
