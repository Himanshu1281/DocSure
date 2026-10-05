import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { RootStackParamList } from '../../../../core/navigation/RootNavigator';
import { UpcomingBookingCard } from '../components/UpcomingBookingCard';
import { PastBookingCard } from '../components/PastBookingCard';
import { EmergencyAlertBox } from '../components/EmergencyAlertBox';
import { BookingsStatsRow } from '../components/BookingsStatsRow';
import { useBookingsStore, splitBookings, formatDate, formatDateTime } from '../../viewmodels/useBookingsStore';
import { Booking } from '../../domain/entities/Booking';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const iconFor = (specialty: string): keyof typeof MaterialIcons.glyphMap => {
  const s = specialty.toLowerCase();
  if (s.includes('cardio')) return 'favorite';
  if (s.includes('dent')) return 'sentiment-satisfied';
  if (s.includes('hospital')) return 'local-hospital';
  return 'medical-services';
};

export const BookingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const bookings = useBookingsStore(s => s.bookings);
  const cancel = useBookingsStore(s => s.cancel);
  // Bumped on pull-to-refresh so bookings whose time has passed move to "Past"
  const [now, setNow] = useState(Date.now());
  const { upcoming, past } = useMemo(() => splitBookings(bookings, now), [bookings, now]);

  const onRefresh = useCallback(() => setNow(Date.now()), []);
  // Re-evaluate on every visit so finished appointments move to "Past"
  useFocusEffect(onRefresh);

  const confirmCancel = (booking: Booking) => {
    Alert.alert(
      'Cancel appointment?',
      `${booking.doctor.name}
${formatDateTime(booking.startsAt)}`,
      [
        { text: 'Keep', style: 'cancel' },
        { text: 'Cancel appointment', style: 'destructive', onPress: () => cancel(booking.id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Bookings</Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {upcoming.length === 0 ? (
            <>
              <Text style={styles.empty}>No upcoming appointments.</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'DiscoverTab' })}>
                <Text style={styles.link}>Find a doctor nearby</Text>
              </TouchableOpacity>
            </>
          ) : upcoming.map(b => (
            <UpcomingBookingCard 
              key={b.id}
              doctorName={b.doctor.name}
              specialty={b.doctor.specialty}
              dateTime={formatDateTime(b.startsAt)}
              iconName={iconFor(b.doctor.specialty)}
              onPress={() => navigation.navigate('DoctorDetail', { id: b.doctor.id })}
              onReschedule={() => navigation.navigate('BookAppointment', { doctorId: b.doctor.id, bookingId: b.id })}
              onCancel={() => confirmCancel(b)}
            />
          ))}
        </View>

        {past.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past</Text>
            {past.map(b => (
              <PastBookingCard 
                key={b.id}
                doctorName={b.doctor.name}
                specialty={b.doctor.specialty}
                date={formatDate(b.startsAt)}
                isCancelled={b.status === 'cancelled'}
              />
            ))}
          </View>
        )}

        <EmergencyAlertBox />

        <BookingsStatsRow
          total={bookings.filter(b => b.status !== 'cancelled').length}
          upcoming={upcoming.length}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  container: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  pageTitle: {
    ...theme.typography.h1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  empty: {
    ...theme.typography.body,
    marginBottom: theme.spacing.sm,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
