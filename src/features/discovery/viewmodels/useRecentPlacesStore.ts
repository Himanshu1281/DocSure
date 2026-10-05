import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage, STORAGE_KEYS } from '../../../core/storage/persistStorage';
import { Place } from '../data/datasources/NominatimGeocoder';

const MAX_RECENT = 5;

interface RecentPlacesStore {
  places: Place[];
  add: (place: Place) => void;
  remove: (id: string) => void;
  clear: () => void;
}

// Places searched before (e.g. a parent's home city), so they're one tap away next time
export const useRecentPlacesStore = create<RecentPlacesStore>()(
  persist(
    (set) => ({
      places: [],
      add: (place) =>
        set(state => ({
          places: [place, ...state.places.filter(p => p.id !== place.id)].slice(0, MAX_RECENT),
        })),
      remove: (id) => set(state => ({ places: state.places.filter(p => p.id !== id) })),
      clear: () => set({ places: [] }),
    }),
    { name: STORAGE_KEYS.recentPlaces, storage: persistStorage }
  )
);
