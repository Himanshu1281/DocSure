import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage, STORAGE_KEYS } from '../../../core/storage/persistStorage';

export interface ProfileData {
  name: string;
  subtitle: string;
  phone: string;
}

interface ProfileStore extends ProfileData {
  updatedAt: string | null;
  save: (data: ProfileData) => void;
  clear: () => void;
  // Apply the cloud copy without bumping updatedAt (used by sync)
  applyRemote: (data: ProfileData & { updatedAt: string }) => void;
}

const EMPTY: ProfileData = { name: '', subtitle: '', phone: '' };

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      ...EMPTY,
      updatedAt: null,
      save: (data) => set({ ...data, updatedAt: new Date().toISOString() }),
      clear: () => set({ ...EMPTY, updatedAt: null }),
      applyRemote: (data) => set(data),
    }),
    { name: STORAGE_KEYS.profile, storage: persistStorage }
  )
);
