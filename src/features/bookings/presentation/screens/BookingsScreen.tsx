import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../../core/theme';
import { UpcomingBookingCard } from '../components/UpcomingBookingCard';
import { PastBookingCard } from '../components/PastBookingCard';
import { EmergencyAlertBox } from '../components/EmergencyAlertBox';
import { BookingsStatsRow } from '../components/BookingsStatsRow';

export const BookingsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Bookings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <UpcomingBookingCard 
            doctorName="Dr. Sarah Jenkins"
            specialty="Senior Cardiologist"
            dateTime="Oct 24, 2023 · 09:30 AM"
            iconName="favorite"
          />
          <UpcomingBookingCard 
            doctorName="Dr. Marcus Thorne"
            specialty="Internal Medicine"
            dateTime="Oct 27, 2023 · 02:15 PM"
            iconName="local-hospital"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past</Text>

          <PastBookingCard 
            doctorName="Dr. Elena Rodriguez"
            specialty="Dermatologist"
            date="Sep 12, 2023"
          />

          <PastBookingCard 
            doctorName="Dr. Simon Choi"
            specialty="Orthopedics"
            date="Aug 30, 2023"
          />
        </View>

        <EmergencyAlertBox />

        <BookingsStatsRow total={12} upcoming={2} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    padding: theme.spacing.xl,
    paddingBottom: 100,
  },
  pageTitle: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  }
});
