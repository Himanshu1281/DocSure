import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage, STORAGE_KEYS } from '../../../core/storage/persistStorage';
import { Booking, BookedDoctor } from '../domain/entities/Booking';

interface BookingsStore {
  bookings: Booking[];
  addBooking: (doctor: BookedDoctor, startsAt: Date) => Booking;
  reschedule: (id: string, startsAt: Date) => void;
  cancel: (id: string) => void;
  clear: () => void;
}

const newId = () => `bk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const useBookingsStore = create<BookingsStore>()(
  persist(
    (set) => ({
      bookings: [],

      addBooking: (doctor, startsAt) => {
        const booking: Booking = {
          id: newId(),
          doctor,
          startsAt: startsAt.toISOString(),
          status: 'requested',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ bookings: [...state.bookings, booking] }));
        return booking;
      },

      reschedule: (id, startsAt) =>
        set(state => ({
          bookings: state.bookings.map(b =>
            b.id === id ? { ...b, startsAt: startsAt.toISOString(), status: 'requested' } : b
          ),
        })),

      cancel: (id) =>
        set(state => ({
          bookings: state.bookings.map(b => (b.id === id ? { ...b, status: 'cancelled' } : b)),
        })),

      clear: () => set({ bookings: [] }),
    }),
    { name: STORAGE_KEYS.bookings, storage: persistStorage }
  )
);

// Upcoming: active and in the future, soonest first. Past: everything else, newest first.
export const splitBookings = (bookings: Booking[], now = Date.now()) => {
  const upcoming = bookings
    .filter(b => b.status !== 'cancelled' && new Date(b.startsAt).getTime() >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const past = bookings
    .filter(b => !upcoming.includes(b))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  return { upcoming, past };
};

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
