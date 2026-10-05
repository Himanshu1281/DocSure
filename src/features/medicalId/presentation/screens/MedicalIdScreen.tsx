import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../../../core/theme';
import { RootStackParamList } from '../../../../core/navigation/RootNavigator';
import { callNumber } from '../../../../core/utils/linking';
import { useMedicalIdStore } from '../../viewmodels/useMedicalIdStore';

import { MedicalQRCard } from '../components/MedicalQRCard';
import { MedicationListItem } from '../components/MedicationListItem';
import { ContactListItem } from '../components/ContactListItem';
import { VitalsGrid } from '../components/VitalsGrid';

export const MedicalIdScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const medical = useMedicalIdStore();

  const metrics = [medical.heightCm && `${medical.heightCm}cm`, medical.weightKg && `${medical.weightKg}kg`]
    .filter(Boolean)
    .join(' / ') || '—';
  const donor = medical.organDonor == null ? '—' : medical.organDonor ? 'YES' : 'NO';
  const updated = medical.updatedAt
    ? `Updated ${new Date(medical.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
    : 'Not set up yet';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={[styles.header, styles.sectionHeader]}>
        <View>
          <Text style={styles.pageTitle}>Medical ID</Text>
          <Text style={styles.subtitle}>{updated}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditMedicalId')}>
          <Text style={styles.editText}>{medical.updatedAt ? 'Edit' : 'Set up'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>

        <MedicalQRCard dossierId={medical.dossierId} />

        {(medical.bloodGroup || medical.allergies) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Info</Text>
            {medical.bloodGroup ? <Text style={styles.infoText}>Blood group: {medical.bloodGroup}</Text> : null}
            {medical.allergies ? <Text style={styles.infoText}>Allergies: {medical.allergies}</Text> : null}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          {medical.medications.length === 0 ? (
            <Text style={styles.empty}>No medications added.</Text>
          ) : (
            <View style={styles.medCard}>
              {medical.medications.map((m, i) => (
                <MedicationListItem key={m.id} name={m.name} frequency={m.frequency}
                  isLast={i === medical.medications.length - 1} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {medical.contacts.length === 0 && <Text style={styles.empty}>No emergency contacts added.</Text>}
          {medical.contacts.map(c => (
            <ContactListItem key={c.id} name={c.name} relation={c.relation} onCall={() => callNumber(c.phone)} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitals</Text>
          <VitalsGrid donor={donor} metrics={metrics} />
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
    marginBottom: 4,
  },
  subtitle: {
    ...theme.typography.body,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  empty: {
    ...theme.typography.body,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  medCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.card,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }
});

