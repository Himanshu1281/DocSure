import { DoctorRepository } from '../domain/repositories/DoctorRepository';
import { GooglePlacesDoctorRepository } from './datasources/GooglePlacesDoctorRepository';
import { OsmDoctorRepository } from './datasources/OsmDoctorRepository';
import { MockDoctorRepository } from './datasources/MockDoctorDataSource';

// EXPO_PUBLIC_DOCTOR_PROVIDER: 'osm' (default, free) | 'google' | 'mock'
const provider = process.env.EXPO_PUBLIC_DOCTOR_PROVIDER ?? 'osm';
const placesKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const createRepository = (): DoctorRepository => {
  if (provider === 'mock') return new MockDoctorRepository();
  if (provider === 'google') {
    if (placesKey) return new GooglePlacesDoctorRepository(placesKey);
    console.warn('EXPO_PUBLIC_GOOGLE_PLACES_API_KEY not set — falling back to OpenStreetMap.');
  }
  return new OsmDoctorRepository();
};

export const doctorRepository = createRepository();
