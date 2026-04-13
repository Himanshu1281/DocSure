import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../../core/theme';

import { ProfileHeader } from '../components/ProfileHeader';
import { SettingsMenuRow } from '../components/SettingsMenuRow';

export const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileHeader 
          initials="ER"
          name="Elena Rostova"
          subtitle="FreeLancer"
          version="Version 4.2.0 (Clinical Build)"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsMenuRow icon="settings" title="Preferences" />
          <SettingsMenuRow icon="payment" title="Billing & Payments" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <SettingsMenuRow icon="privacy-tip" title="Privacy Policy" />
          <SettingsMenuRow icon="description" title="Terms of Service" />
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  logoutBtn: {
    marginTop: theme.spacing.xl,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: theme.radius.btn,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: 16,
  }
});
