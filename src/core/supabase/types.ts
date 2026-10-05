// Row shapes of the tables in supabase/migrations. Regenerate with
// `npx supabase gen types typescript` once the project grows.

export interface ProfileRow {
  id: string;
  name: string;
  subtitle: string;
  phone: string;
  updated_at: string;
}

export interface MedicalIdRow {
  user_id: string;
  dossier_id: string;
  blood_group: string;
  allergies: string;
  organ_donor: boolean | null;
  height_cm: string;
  weight_kg: string;
  medications: { id: string; name: string; frequency: string }[];
  contacts: { id: string; name: string; relation: string; phone: string }[];
  updated_at: string;
}

export interface BookingRow {
  id: string;
  user_id: string;
  doctor_id: string;
  doctor: {
    id: string;
    name: string;
    specialty: string;
    hospital: string;
    phone: string | null;
    latitude: number;
    longitude: number;
  };
  starts_at: string;
  status: 'requested' | 'cancelled';
  created_at: string;
  updated_at: string;
}
