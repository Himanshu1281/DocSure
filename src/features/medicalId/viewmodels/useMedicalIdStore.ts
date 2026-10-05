import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage, STORAGE_KEYS } from '../../../core/storage/persistStorage';

export interface Medication {
  id: string;
  name: string;
  frequency: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface MedicalIdData {
  bloodGroup: string;
  allergies: string;
  organDonor: boolean | null;
  heightCm: string;
  weightKg: string;
  medications: Medication[];
  contacts: EmergencyContact[];
}

interface MedicalIdStore extends MedicalIdData {
  dossierId: string;
  updatedAt: string | null;
  save: (data: MedicalIdData) => void;
  clear: () => void;
  // Apply the cloud copy without bumping updatedAt (used by sync)
  applyRemote: (data: MedicalIdData & { dossierId: string; updatedAt: string }) => void;
}

export const newRowId = () => Math.random().toString(36).slice(2, 10);

const newDossierId = () =>
  `DS-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`;

const EMPTY: MedicalIdData = {
  bloodGroup: '',
  allergies: '',
  organDonor: null,
  heightCm: '',
  weightKg: '',
  medications: [],
  contacts: [],
};

export const useMedicalIdStore = create<MedicalIdStore>()(
  persist(
    (set) => ({
      ...EMPTY,
      dossierId: newDossierId(),
      updatedAt: null,
      save: (data) => set({ ...data, updatedAt: new Date().toISOString() }),
      clear: () => set({ ...EMPTY, dossierId: newDossierId(), updatedAt: null }),
      applyRemote: (data) => set(data),
    }),
    { name: STORAGE_KEYS.medicalId, storage: persistStorage }
  )
);
