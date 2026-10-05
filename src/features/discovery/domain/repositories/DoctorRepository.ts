import { Doctor } from '../entities/Doctor';

export interface NearbyQuery {
  latitude: number;
  longitude: number;
  city: string;
  radiusMeters?: number;
}

export interface DoctorRepository {
  getNearby(query: NearbyQuery): Promise<Doctor[]>;
  getById(id: string, origin?: { latitude: number; longitude: number; city: string }): Promise<Doctor | null>;
}
