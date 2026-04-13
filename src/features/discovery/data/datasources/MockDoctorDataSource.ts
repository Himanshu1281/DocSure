import { Doctor } from '../../domain/entities/Doctor';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Aarav Sharma',
    specialty: 'General Physician',
    hospital: 'Apollo Spectra, Karol Bagh',
    rating: 4.8,
    consultationFee: 700,
    distance: 0.8,
    isVerified: true,
    languages: ['Hindi', 'English'],
    waitTime: 'Same day',
    city: 'Delhi',
    latitude: 28.6538,
    longitude: 77.1950,
  },
  {
    id: '2',
    name: 'Dr. Priya Desai',
    specialty: 'Dermatologist',
    hospital: 'Max Super Speciality',
    rating: 4.9,
    consultationFee: 1200,
    distance: 1.2,
    isVerified: true,
    languages: ['English', 'Marathi'],
    waitTime: '15 mins',
    city: 'Mumbai',
    latitude: 28.6550,
    longitude: 77.1900,
  },
  {
    id: '3',
    name: 'Dr. Ravi Kumar',
    specialty: 'Cardiologist',
    hospital: 'Fortis Escorts',
    rating: 4.6,
    consultationFee: 1500,
    distance: 3.4,
    isVerified: false,
    languages: ['English', 'Telugu'],
    waitTime: '1 hour',
    city: 'Hyderabad',
    latitude: 28.6600,
    longitude: 77.1850,
  }
];

export const fetchNearbyDoctors = async (): Promise<Doctor[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockDoctors), 1000));
};
