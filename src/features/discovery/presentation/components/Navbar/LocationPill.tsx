import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { theme } from '../../../../../core/theme';

interface LocationPillProps {
  city: string | null;
  isLoading: boolean;
  isSearchedPlace: boolean;
  onPress: () => void;
}

export const LocationPill: React.FC<LocationPillProps> = ({ city, isLoading, isSearchedPlace, onPress }) => {
  // useRef keeps one Animated.Value for the component's lifetime; creating one per
  // render started a new never-stopped native loop on every re-render (memory leak)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse only while detecting location, and always stop the loop on cleanup
  const shouldPulse = isLoading && !isSearchedPlace;
  useEffect(() => {
    if (!shouldPulse) {
      pulseAnim.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shouldPulse, pulseAnim]);

  return (
    <TouchableOpacity style={styles.locationPill} onPress={onPress} accessibilityRole="button" accessibilityLabel="Change search location">
      <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
      <Text style={styles.locationText} numberOfLines={1}>
        {isLoading && !isSearchedPlace ? 'Detecting location...' : `${isSearchedPlace ? '🔎' : '📍'} ${city} ▾`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  locationPill: {
    maxWidth: 200,
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
    flexShrink: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
