import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

// Shared on-device storage for persisted zustand stores
export const persistStorage = createJSONStorage(() => AsyncStorage);

export const STORAGE_KEYS = {
  bookings: 'docsure.bookings',
  medicalId: 'docsure.medicalId',
  profile: 'docsure.profile',
  recentPlaces: 'docsure.recentPlaces',
} as const;
