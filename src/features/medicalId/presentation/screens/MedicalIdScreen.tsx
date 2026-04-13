import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../../core/theme';

import { MedicalQRCard } from '../components/MedicalQRCard';
import { MedicationListItem } from '../components/MedicationListItem';
import { ContactListItem } from '../components/ContactListItem';
import { VitalsGrid } from '../components/VitalsGrid';

export const MedicalIdScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Medical ID</Text>
        <Text style={styles.subtitle}>Updated 12 minutes ago</Text>

        <MedicalQRCard />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          <View style={styles.medCard}>
            <MedicationListItem name="Lisinopril 10mg" frequency="Once daily" />
            <MedicationListItem name="Metformin 500mg" frequency="Twice daily" isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <ContactListItem name="Sarah Jenkins" relation="Spouse" />
          <ContactListItem name="Dr. Robert Chen" relation="Primary Physician" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitals</Text>
          <VitalsGrid donor="YES" metrics="182cm / 78kg" />
        </View>
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
    marginBottom: 4,
  },
  subtitle: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  medCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.card,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }
});

