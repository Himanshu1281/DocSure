import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { theme } from '../../../../core/theme';
import { RootStackParamList } from '../../../../core/navigation/RootNavigator';
import { getInitials } from '../../../discovery/utils/getInitials';
import { useProfileStore } from '../../viewmodels/useProfileStore';
import { useBookingsStore } from '../../../bookings/viewmodels/useBookingsStore';
import { useMedicalIdStore } from '../../../medicalId/viewmodels/useMedicalIdStore';
import { useRecentPlacesStore } from '../../../discovery/viewmodels/useRecentPlacesStore';
import { useAuthStore } from '../../../account/viewmodels/useAuthStore';

import { ProfileHeader } from '../components/ProfileHeader';
import { SettingsMenuRow } from '../components/SettingsMenuRow';

const comingSoon = (feature: string) => Alert.alert(feature, 'This is not available yet.');

export const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { name, subtitle } = useProfileStore();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const { isConfigured, session, syncStatus, lastSyncedAt, syncNow, signOut: authSignOut, isSigningOut } = useAuthStore();
  const email = session?.user.email;

  const syncLabel =
    syncStatus === 'syncing' ? 'Syncing…' :
    syncStatus === 'error' ? 'Sync failed — tap to retry' :
    lastSyncedAt ? `Synced ${new Date(lastSyncedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}` :
    'Tap to sync';

  const signOut = () => {
    Alert.alert(
      session ? 'Sign out?' : 'Clear data on this device?',
      session
        ? 'Your data stays backed up in your account. This device will be cleared.'
        : 'This removes your profile, bookings, Medical ID and recent places from this device. It is not backed up.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: session ? 'Sign Out' : 'Clear Data',
          style: 'destructive',
          onPress: () => {
            if (session) {
              authSignOut();
            } else {
              useProfileStore.getState().clear();
              useBookingsStore.getState().clear();
              useMedicalIdStore.getState().clear();
              useRecentPlacesStore.getState().clear();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileHeader 
          initials={name ? getInitials(name) : '?'}
          name={name || 'Set up your profile'}
          subtitle={subtitle}
          version={`Version ${version}`}
        />

        {isConfigured && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cloud Backup</Text>
            {session ? (
              <SettingsMenuRow icon="cloud-done" title={`${email ?? 'Signed in'} · ${syncLabel}`} onPress={syncNow} />
            ) : (
              <SettingsMenuRow icon="cloud-upload" title="Sign in to back up your data" onPress={() => navigation.navigate('SignIn')} />
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsMenuRow icon="person" title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
          <SettingsMenuRow icon="medical-information" title="Medical ID" onPress={() => navigation.navigate('EditMedicalId')} />
          <SettingsMenuRow icon="payment" title="Billing & Payments" onPress={() => comingSoon('Billing & Payments')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <SettingsMenuRow icon="privacy-tip" title="Privacy Policy" onPress={() => comingSoon('Privacy Policy')} />
          <SettingsMenuRow icon="description" title="Terms of Service" onPress={() => comingSoon('Terms of Service')} />
        </View>

      </ScrollView>

      <View style={styles.fixedBottom}>
        <TouchableOpacity
          style={[styles.logoutBtn, isSigningOut && styles.logoutBtnBusy]}
          onPress={signOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <View style={styles.busyRow}>
              <ActivityIndicator color={theme.colors.danger} />
              <Text style={styles.logoutText}>Signing out…</Text>
            </View>
          ) : (
            <Text style={styles.logoutText}>{session ? 'Sign Out' : 'Clear Data on This Device'}</Text>
          )}
        </TouchableOpacity>
      </View>

      {isSigningOut && (
        <View style={styles.overlay} pointerEvents="auto">
          <View style={styles.overlayCard}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.overlayText}>Signing out…</Text>
          </View>
        </View>
      )}
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
    paddingBottom: theme.spacing.xxl,
  },
  fixedBottom: {
    padding: theme.spacing.xl,
    paddingTop: 0,
    backgroundColor: theme.colors.surface,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  logoutBtn: {
    marginTop: 0,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: theme.radius.btn,
  },
  logoutBtnBusy: {
    opacity: 0.8,
  },
  busyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayCard: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.xl,
    borderRadius: theme.radius.card,
    alignItems: 'center',
    gap: theme.spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  overlayText: {
    ...theme.typography.h2,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: 16,
  }
});
