import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { RootStackParamList } from '../../../../core/navigation/RootNavigator';
import { callNumber } from '../../../../core/utils/linking';
import { useDiscoveryViewModel } from '../../../discovery/viewmodels/useDiscoveryViewModel';
import { useBookingsStore, formatDateTime } from '../../viewmodels/useBookingsStore';
import { BookedDoctor } from '../../domain/entities/Booking';

type BookRouteProp = RouteProp<RootStackParamList, 'BookAppointment'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS_AHEAD = 7;
const FIRST_HOUR = 9;
const LAST_HOUR = 18; // last slot starts 17:30
const SLOT_MINUTES = 30;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const buildDays = () => {
  const today = startOfDay(new Date());
  return Array.from({ length: DAYS_AHEAD }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
  );
};

const buildSlots = (day: Date) => {
  const slots: Date[] = [];
  for (let m = FIRST_HOUR * 60; m < LAST_HOUR * 60; m += SLOT_MINUTES) {
    slots.push(new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(m / 60), m % 60));
  }
  return slots;
};

export const BookAppointmentScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { doctorId, bookingId, doctor: passedDoctor } = useRoute<BookRouteProp>().params;

  const existing = useBookingsStore(s => s.bookings.find(b => b.id === bookingId));
  const bookings = useBookingsStore(s => s.bookings);
  const addBooking = useBookingsStore(s => s.addBooking);
  const reschedule = useBookingsStore(s => s.reschedule);
  const listedDoctor = useDiscoveryViewModel(s => s.doctors.find(d => d.id === doctorId));

  const doctor: BookedDoctor | undefined = existing?.doctor ?? passedDoctor ?? (listedDoctor && {
    id: listedDoctor.id,
    name: listedDoctor.name,
    specialty: listedDoctor.specialty,
    hospital: listedDoctor.hospital,
    phone: listedDoctor.phone,
    latitude: listedDoctor.latitude,
    longitude: listedDoctor.longitude,
  });

  const days = useMemo(buildDays, []);
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState<Date | null>(null);
  const slots = useMemo(() => buildSlots(days[dayIndex]), [days, dayIndex]);

  // Times this user already holds with this doctor
  const takenTimes = useMemo(
    () => new Set(
      bookings
        .filter(b => b.doctor.id === doctorId && b.status !== 'cancelled' && b.id !== bookingId)
        .map(b => new Date(b.startsAt).getTime())
    ),
    [bookings, doctorId, bookingId]
  );

  if (!doctor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>Doctor not available</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const confirm = () => {
    if (!slot) return;
    if (existing) {
      reschedule(existing.id, slot);
    } else {
      addBooking(doctor, slot);
    }

    const goToBookings = () => navigation.navigate('MainTabs', { screen: 'BookingsTab' });
    const buttons: { text: string; onPress: () => void }[] = [{ text: 'View Bookings', onPress: goToBookings }];
    if (doctor.phone) {
      const phone = doctor.phone;
      buttons.unshift({ text: 'Call Clinic', onPress: () => { goToBookings(); callNumber(phone); } });
    }
    Alert.alert(
      existing ? 'Appointment rescheduled' : 'Appointment requested',
      `${doctor.name}\n${formatDateTime(slot.toISOString())}\n\nThis clinic doesn't take online bookings yet — please call to confirm your slot.`,
      buttons
    );
  };

  const now = Date.now();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{existing ? 'Reschedule' : 'Book Consult'}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{doctor.name}</Text>
        <Text style={styles.subtitle}>{doctor.specialty} · {doctor.hospital}</Text>

        <Text style={styles.sectionTitle}>Day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {days.map((d, i) => {
            const active = i === dayIndex;
            return (
              <TouchableOpacity
                key={d.toISOString()}
                style={[styles.dayChip, active && styles.chipActive]}
                onPress={() => { setDayIndex(i); setSlot(null); }}
              >
                <Text style={[styles.dayName, active && styles.chipTextActive]}>
                  {i === 0 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' })}
                </Text>
                <Text style={[styles.dayNum, active && styles.chipTextActive]}>{d.getDate()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Time</Text>
        <View style={styles.slotGrid}>
          {slots.map(s => {
            const disabled = s.getTime() <= now || takenTimes.has(s.getTime());
            const active = slot?.getTime() === s.getTime();
            return (
              <TouchableOpacity
                key={s.toISOString()}
                disabled={disabled}
                style={[styles.slotChip, active && styles.chipActive, disabled && styles.slotDisabled]}
                onPress={() => setSlot(s)}
              >
                <Text style={[styles.slotText, active && styles.chipTextActive]}>
                  {s.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {slots.every(s => s.getTime() <= now) && (
          <Text style={styles.hint}>No slots left today — pick another day.</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryBtn, !slot && styles.primaryBtnDisabled]}
          disabled={!slot}
          onPress={confirm}
        >
          <Text style={styles.primaryBtnText}>
            {slot ? `Confirm · ${formatDateTime(slot.toISOString())}` : 'Select a time'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h2,
    fontSize: 16,
  },
  headerRight: {
    width: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  container: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
  title: {
    ...theme.typography.h1,
  },
  subtitle: {
    ...theme.typography.body,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  chipRow: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  dayChip: {
    width: 64,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  dayName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  dayNum: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  slotChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.btn,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 88,
    alignItems: 'center',
  },
  slotDisabled: {
    opacity: 0.35,
  },
  slotText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  hint: {
    ...theme.typography.body,
    marginTop: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.radius.btn,
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
