import { create } from 'zustand';
import { Doctor } from '../domain/entities/Doctor';
import { fetchNearbyDoctors } from '../data/datasources/MockDoctorDataSource';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  isLoading: boolean;
  error: string | null;
}

interface FilterState {
  specialty: string;
  language: string;
  maxFee: number;
  openNow: boolean;
}

interface DiscoveryViewModel {
  // State
  doctors: Doctor[];
  isLoadingDoctors: boolean;
  selectedDoctorId: string | null;
  userLocation: LocationState;
  filters: FilterState;

  // Actions
  loadLocation: () => Promise<void>;
  loadDoctors: () => Promise<void>;
  setSelectedDoctor: (id: string | null) => void;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

export const useDiscoveryViewModel = create<DiscoveryViewModel>((set, get) => ({
  doctors: [],
  isLoadingDoctors: true,
  selectedDoctorId: null,
  userLocation: {
    latitude: null,
    longitude: null,
    city: null,
    isLoading: true,
    error: null,
  },
  filters: {
    specialty: 'All Specialties',
    language: 'All Languages',
    maxFee: 2000,
    openNow: false,
  },

  loadLocation: async () => {
    set((state) => ({ userLocation: { ...state.userLocation, isLoading: true } }));
    
    // Using simple mock loading here to avoid simulator permission hangs immediately on boot.
    // In actual implementation, we use expo-location.
    setTimeout(() => {
      set({
        userLocation: {
          latitude: 28.4595,
          longitude: 77.0266,
          city: 'Gurugram, HR',
          isLoading: false,
          error: null,
        }
      });
      get().loadDoctors();
    }, 1500);
  },

  loadDoctors: async () => {
    set({ isLoadingDoctors: true });
    try {
      const data = await fetchNearbyDoctors();
      set({ doctors: data, isLoadingDoctors: false });
    } catch (e) {
      set({ isLoadingDoctors: false });
    }
  },

  setSelectedDoctor: (id) => set({ selectedDoctorId: id }),

  updateFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    // In a real app we would trigger a refetch of doctors here based on updated filters.
  },

  resetFilters: () => set({
    filters: {
      specialty: 'All Specialties',
      language: 'All Languages',
      maxFee: 2000,
      openNow: false,
    }
  })
}));
