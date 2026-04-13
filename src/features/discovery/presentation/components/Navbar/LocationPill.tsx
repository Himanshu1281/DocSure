import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../../../../../core/theme';

interface LocationPillProps {
  city: string | null;
  isLoading: boolean;
}

export const LocationPill: React.FC<LocationPillProps> = ({ city, isLoading }) => {
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
    <View style={styles.locationPill}>
      <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
      <Text style={styles.locationText}>
        {isLoading ? 'Detecting location...' : `📍 ${city}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
