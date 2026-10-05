import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
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

import { ProfileHeader } from '../components/ProfileHeader';
import { SettingsMenuRow } from '../components/SettingsMenuRow';

const comingSoon = (feature: string) => Alert.alert(feature, 'This is not available yet.');

export const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { name, subtitle } = useProfileStore();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const signOut = () => {
    Alert.alert(
      'Sign out?',
      'This removes your profile, bookings, Medical ID and recent places from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            useProfileStore.getState().clear();
            useBookingsStore.getState().clear();
            useMedicalIdStore.getState().clear();
            useRecentPlacesStore.getState().clear();
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
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <Text style={styles.logoutText}>Sign Out</Text>
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
  logoutText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: 16,
  }
});
