import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage, STORAGE_KEYS } from '../../../core/storage/persistStorage';

export interface ProfileData {
  name: string;
  subtitle: string;
  phone: string;
}

interface ProfileStore extends ProfileData {
  save: (data: ProfileData) => void;
  clear: () => void;
}

const EMPTY: ProfileData = { name: '', subtitle: '', phone: '' };

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      ...EMPTY,
      save: (data) => set(data),
      clear: () => set(EMPTY),
    }),
    { name: STORAGE_KEYS.profile, storage: persistStorage }
  )
);
