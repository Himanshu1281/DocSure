import { Doctor } from '../../domain/entities/Doctor';
import { DoctorRepository } from '../../domain/repositories/DoctorRepository';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Aarav Sharma',
    specialty: 'General Physician',
    hospital: 'Apollo Spectra, Karol Bagh',
    rating: 4.8,
    reviewCount: 212,
    consultationFee: 700,
    distance: 0.8,
    isVerified: true,
    languages: ['Hindi', 'English'],
    waitTime: 'Same day',
    isOpenNow: true,
    address: null,
    phone: null,
    city: 'Delhi',
    latitude: 28.6538,
    longitude: 77.1950,
    source: 'mock',
  },
  {
    id: '2',
    name: 'Dr. Priya Desai',
    specialty: 'Dermatologist',
    hospital: 'Max Super Speciality',
    rating: 4.9,
    reviewCount: 98,
    consultationFee: 1200,
    distance: 1.2,
    isVerified: true,
    languages: ['English', 'Marathi'],
    waitTime: '15 mins',
    isOpenNow: true,
    address: null,
    phone: null,
    city: 'Delhi',
    latitude: 28.6550,
    longitude: 77.1900,
    source: 'mock',
  },
  {
    id: '3',
    name: 'Dr. Ravi Kumar',
    specialty: 'Cardiologist',
    hospital: 'Fortis Escorts',
    rating: 4.6,
    reviewCount: 340,
    consultationFee: 1500,
    distance: 3.4,
    isVerified: false,
    languages: ['English', 'Telugu'],
    waitTime: '1 hour',
    isOpenNow: false,
    address: null,
    phone: null,
    city: 'Delhi',
    latitude: 28.6600,
    longitude: 77.1850,
    source: 'mock',
  }
];

export class MockDoctorRepository implements DoctorRepository {
  async getNearby(): Promise<Doctor[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockDoctors), 1000));
  }

  async getById(id: string): Promise<Doctor | null> {
    return mockDoctors.find(d => d.id === id) ?? null;
  }
}
