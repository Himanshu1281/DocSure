export type BookingStatus = 'requested' | 'cancelled';

// Snapshot of the doctor at booking time, so bookings render without a network fetch
export interface BookedDoctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  phone: string | null;
  latitude: number;
  longitude: number;
}

export interface Booking {
  id: string;
  doctor: BookedDoctor;
  startsAt: string; // ISO timestamp
  status: BookingStatus;
  createdAt: string;
  // Last local or remote change; used to resolve sync conflicts (newest wins)
  updatedAt: string;
}
