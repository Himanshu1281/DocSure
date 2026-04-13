import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../../../../core/theme';

interface NavbarProps {
  city: string | null;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ city, isLoading }) => {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoCross}>+</Text>
        </View>
        <Text style={styles.appName}>DocSure</Text>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.locationPill}>
          <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
          <Text style={styles.locationText}>
            {isLoading ? 'Detecting location...' : `📍 ${city}`}
          </Text>
        </View>
        <Text style={styles.emergencyText}>Emergency?</Text>
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
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.primary,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  emergencyText: {
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: '600',
  }
});
