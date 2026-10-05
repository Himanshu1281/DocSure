import { supabase } from '../../../core/supabase/client';
import { BookingRow, MedicalIdRow, ProfileRow } from '../../../core/supabase/types';
import { Booking } from '../../bookings/domain/entities/Booking';
import { useBookingsStore } from '../../bookings/viewmodels/useBookingsStore';
import { useMedicalIdStore } from '../../medicalId/viewmodels/useMedicalIdStore';
import { useProfileStore } from '../../profile/viewmodels/useProfileStore';

// Local zustand stores stay the source of truth for the UI (and work offline).
// While signed in, this module:
//   1. on sign-in / app start: merges local and cloud data, newest change wins
//   2. afterwards: pushes every local change to Supabase (write-through)

const isNewer = (a: string | null | undefined, b: string | null | undefined) =>
  !!a && (!b || new Date(a).getTime() > new Date(b).getTime());

// ─── Row mappers ─────────────────────────────────────────────────────────
const bookingToRow = (b: Booking, userId: string): Omit<BookingRow, 'updated_at'> => ({
  id: b.id,
  user_id: userId,
  doctor_id: b.doctor.id,
  doctor: b.doctor,
  starts_at: b.startsAt,
  status: b.status,
  created_at: b.createdAt,
});

const rowToBooking = (r: BookingRow): Booking => ({
  id: r.id,
  doctor: r.doctor,
  startsAt: r.starts_at,
  status: r.status,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const medicalToRow = (userId: string): Omit<MedicalIdRow, 'updated_at'> => {
  const m = useMedicalIdStore.getState();
  return {
    user_id: userId,
    dossier_id: m.dossierId,
    blood_group: m.bloodGroup,
    allergies: m.allergies,
    organ_donor: m.organDonor,
    height_cm: m.heightCm,
    weight_kg: m.weightKg,
    medications: m.medications,
    contacts: m.contacts,
  };
};

const profileToRow = (userId: string): Omit<ProfileRow, 'updated_at'> => {
  const p = useProfileStore.getState();
  return { id: userId, name: p.name, subtitle: p.subtitle, phone: p.phone };
};

// Set while applying cloud data, so those store updates aren't pushed back up
let applyingRemote = false;
const applyRemote = (fn: () => void) => {
  applyingRemote = true;
  try { fn(); } finally { applyingRemote = false; }
};

// ─── Full sync ───────────────────────────────────────────────────────────
const syncBookings = async (userId: string) => {
  const { data, error } = await supabase!.from('bookings').select('*');
  if (error) throw error;

  const remote = new Map((data as BookingRow[]).map(r => [r.id, rowToBooking(r)]));
  const local = useBookingsStore.getState().bookings;

  const toPush = local.filter(b => isNewer(b.updatedAt, remote.get(b.id)?.updatedAt));
  if (toPush.length > 0) {
    const { error: pushError } = await supabase!
      .from('bookings')
      .upsert(toPush.map(b => bookingToRow(b, userId)));
    if (pushError) throw pushError;
  }

  const merged = new Map(remote);
  toPush.forEach(b => merged.set(b.id, b));
  applyRemote(() => useBookingsStore.getState().replaceAll([...merged.values()]));
};

const syncMedicalId = async (userId: string) => {
  const { data, error } = await supabase!.from('medical_ids').select('*').maybeSingle();
  if (error) throw error;
  const remote = data as MedicalIdRow | null;
  const local = useMedicalIdStore.getState();

  if (isNewer(local.updatedAt, remote?.updated_at)) {
    const { error: pushError } = await supabase!.from('medical_ids').upsert(medicalToRow(userId));
    if (pushError) throw pushError;
  } else if (remote) {
    applyRemote(() => useMedicalIdStore.getState().applyRemote({
      dossierId: remote.dossier_id,
      bloodGroup: remote.blood_group,
      allergies: remote.allergies,
      organDonor: remote.organ_donor,
      heightCm: remote.height_cm,
      weightKg: remote.weight_kg,
      medications: remote.medications,
      contacts: remote.contacts,
      updatedAt: remote.updated_at,
    }));
  }
};

const syncProfile = async (userId: string) => {
  const { data, error } = await supabase!.from('profiles').select('*').maybeSingle();
  if (error) throw error;
  const remote = data as ProfileRow | null;
  const local = useProfileStore.getState();

  // The signup trigger creates an empty row; don't let it wipe a filled-in local profile
  const remoteIsEmpty = !remote || (!remote.name && !remote.subtitle && !remote.phone);
  if (isNewer(local.updatedAt, remote?.updated_at) || (remoteIsEmpty && local.updatedAt)) {
    const { error: pushError } = await supabase!.from('profiles').upsert(profileToRow(userId));
    if (pushError) throw pushError;
  } else if (remote && !remoteIsEmpty) {
    applyRemote(() => useProfileStore.getState().applyRemote({
      name: remote.name,
      subtitle: remote.subtitle,
      phone: remote.phone,
      updatedAt: remote.updated_at,
    }));
  }
};

export const syncAll = async (userId: string) => {
  if (!supabase) return;
  await Promise.all([syncBookings(userId), syncMedicalId(userId), syncProfile(userId)]);
};

// ─── Write-through ───────────────────────────────────────────────────────
const report = (what: string) => ({ error }: { error: unknown }) => {
  // Data stays saved locally; the next full sync (app start / sign-in) retries it
  if (error) console.warn(`Cloud sync failed for ${what}:`, error);
};

// Starts pushing local changes for this user; returns a function that stops it
export const startWriteThrough = (userId: string) => {
  if (!supabase) return () => {};
  const client = supabase;

  const unsubBookings = useBookingsStore.subscribe((state, prev) => {
    if (applyingRemote) return;
    const before = new Map(prev.bookings.map(b => [b.id, b]));
    const changed = state.bookings.filter(b => before.get(b.id) !== b);
    if (changed.length > 0) {
      client.from('bookings').upsert(changed.map(b => bookingToRow(b, userId))).then(report('bookings'));
    }
  });

  const unsubMedical = useMedicalIdStore.subscribe((state, prev) => {
    if (applyingRemote || state.updatedAt === prev.updatedAt || !state.updatedAt) return;
    client.from('medical_ids').upsert(medicalToRow(userId)).then(report('Medical ID'));
  });

  const unsubProfile = useProfileStore.subscribe((state, prev) => {
    if (applyingRemote || state.updatedAt === prev.updatedAt || !state.updatedAt) return;
    client.from('profiles').upsert(profileToRow(userId)).then(report('profile'));
  });

  return () => {
    unsubBookings();
    unsubMedical();
    unsubProfile();
  };
};
