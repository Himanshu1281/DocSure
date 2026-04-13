import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

export const MedicalIdScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Medical ID</Text>
        <Text style={styles.subtitle}>Updated 12 minutes ago</Text>

        <View style={styles.qrCard}>
          <MaterialIcons name="qr-code-2" size={120} color={theme.colors.primaryDark} />
          <Text style={styles.qrTitle}>Emergency Access QR</Text>
          <Text style={styles.qrDesc}>Dossier ID: CC-7729-LX</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          <View style={styles.medCard}>
            <View style={styles.medRow}>
              <MaterialIcons name="medication" size={20} color={theme.colors.primary} />
              <View style={styles.medInfo}>
                <Text style={styles.medName}>Lisinopril 10mg</Text>
                <Text style={styles.medFreq}>Once daily</Text>
              </View>
            </View>
            <View style={[styles.medRow, styles.medRowNoBorder]}>
              <MaterialIcons name="medication" size={20} color={theme.colors.primary} />
              <View style={styles.medInfo}>
                <Text style={styles.medName}>Metformin 500mg</Text>
                <Text style={styles.medFreq}>Twice daily</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.contactRow}>
            <View>
              <Text style={styles.contactName}>Sarah Jenkins</Text>
              <Text style={styles.contactRelation}>Spouse</Text>
            </View>
            <MaterialIcons name="phone" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.contactRow}>
            <View>
              <Text style={styles.contactName}>Dr. Robert Chen</Text>
              <Text style={styles.contactRelation}>Primary Physician</Text>
            </View>
            <MaterialIcons name="phone" size={24} color={theme.colors.primary} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitals</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Organ Donor</Text>
              <Text style={styles.statValue}>YES</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Metrics</Text>
              <Text style={styles.statValue}>182cm / 78kg</Text>
            </View>
          </View>
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
  qrCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.card,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  qrTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.primaryDark,
    marginTop: theme.spacing.md,
    marginBottom: 4,
  },
  qrDesc: {
    ...theme.typography.body,
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
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  medRowNoBorder: {
    borderBottomWidth: 0,
  },
  medInfo: {
    marginLeft: theme.spacing.md,
  },
  medName: {
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  medFreq: {
    ...theme.typography.body,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  contactName: {
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  contactRelation: {
    ...theme.typography.body,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    alignItems: 'flex-start',
  },
  statLabel: {
    ...theme.typography.body,
    color: theme.colors.primaryDark,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
  }
});
