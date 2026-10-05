import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { confirmEmergencyCall } from '../../../../../core/utils/linking';
import { theme } from '../../../../../core/theme';
import { LocationPill } from './LocationPill';

interface NavbarProps {
  city: string | null;
  isLoading: boolean;
  isSearchedPlace: boolean;
  onPressLocation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ city, isLoading, isSearchedPlace, onPressLocation }) => {
  return (
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoCross}>+</Text>
        </View>
        <Text style={styles.appName}>DocSure</Text>
      </View>
      <View style={styles.rightContainer}>
        <LocationPill city={city} isLoading={isLoading} isSearchedPlace={isSearchedPlace} onPress={onPressLocation} />
        <TouchableOpacity onPress={confirmEmergencyCall} accessibilityRole="button">
          <Text style={styles.emergencyText}>Emergency?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 56,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  logoCross: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -2,
  },
  appName: {
    ...theme.typography.h1,
    fontSize: 18,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emergencyText: {
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: '600',
  }
});
