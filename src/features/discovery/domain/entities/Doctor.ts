export type DoctorSource = 'google' | 'osm' | 'mock';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviewCount: number;
  // null when the provider has no fee data (e.g. Google Places listings)
  consultationFee: number | null;
  distance: number;
  isVerified: boolean;
  languages: string[];
  waitTime: string | null;
  isOpenNow: boolean | null;
  address: string | null;
  phone: string | null;
  city: string;
  latitude: number;
  longitude: number;
  source: DoctorSource;
}
