import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

export const BookingsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Bookings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.doctorName}>Dr. Sarah Jenkins</Text>
                <Text style={styles.specialty}>Senior Cardiologist</Text>
              </View>
              <View style={styles.iconCircle}>
                <MaterialIcons name="favorite" size={20} color={theme.colors.primary} />
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.dateTime}>Oct 24, 2023 · 09:30 AM</Text>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Reschedule</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.doctorName}>Dr. Marcus Thorne</Text>
                <Text style={styles.specialty}>Internal Medicine</Text>
              </View>
              <View style={styles.iconCircle}>
                <MaterialIcons name="local-hospital" size={20} color={theme.colors.primary} />
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.dateTime}>Oct 27, 2023 · 02:15 PM</Text>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Reschedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past</Text>

          <View style={styles.pastCard}>
            <View>
              <Text style={styles.doctorName}>Dr. Elena Rodriguez</Text>
              <Text style={styles.specialty}>Dermatologist</Text>
            </View>
            <Text style={styles.pastDate}>Sep 12, 2023</Text>
          </View>

          <View style={styles.pastCard}>
            <View>
              <Text style={styles.doctorName}>Dr. Simon Choi</Text>
              <Text style={styles.specialty}>Orthopedics</Text>
            </View>
            <Text style={styles.pastDate}>Aug 30, 2023</Text>
          </View>
        </View>

        <View style={styles.emergencyBox}>
          <MaterialIcons name="warning" size={24} color={theme.colors.danger} />
          <View style={styles.emergencyTextWrap}>
            <Text style={styles.emergencyTitle}>Need immediate care?</Text>
            <Text style={styles.emergencyDesc}>Our clinical curators are available for emergency virtual consultations 24/7.</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Bookings</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Upcoming</Text>
            <Text style={styles.statValue}>02</Text>
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
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  doctorName: {
    ...theme.typography.doctorName,
    marginBottom: 4,
  },
  specialty: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  dateTime: {
    ...theme.typography.body,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.btn,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  pastCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  pastDate: {
    ...theme.typography.body,
  },
  emergencyBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF0F0',
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  emergencyTextWrap: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  emergencyTitle: {
    fontWeight: '600',
    color: theme.colors.danger,
    marginBottom: 4,
  },
  emergencyDesc: {
    ...theme.typography.body,
    color: theme.colors.danger,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    alignItems: 'center',
  },
  statLabel: {
    ...theme.typography.body,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
  }
});
