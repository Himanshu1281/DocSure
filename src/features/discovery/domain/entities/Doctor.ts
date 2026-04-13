export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  consultationFee: number;
  distance: number;
  isVerified: boolean;
  languages: string[];
  waitTime: string;
  city: string;
  latitude: number;
  longitude: number;
}
