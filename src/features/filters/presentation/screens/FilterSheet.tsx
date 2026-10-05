import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../../core/theme';
import { useDiscoveryViewModel, RADIUS_OPTIONS_KM, FilterState } from '../../../discovery/viewmodels/useDiscoveryViewModel';

import { FilterChipGroup } from '../components/FilterChipGroup';
import { FilterSwitchRow } from '../components/FilterSwitchRow';
import { FilterActionRow } from '../components/FilterActionRow';

export const FilterSheet = () => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { doctors, filters, updateFilters, resetFilters } = useDiscoveryViewModel();
  // Edits are a draft until "Apply Filters"
  const [draft, setDraft] = useState<FilterState>(filters);

  // Only offer specialties that exist in the current results
  const specialties = useMemo(
    () => Array.from(new Set(doctors.map(d => d.specialty))).sort(),
    [doctors]
  );
  const hasOpeningHours = doctors.some(d => d.isOpenNow != null);
  const radiusLabels = RADIUS_OPTIONS_KM.map(km => `${km} km`);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigation.goBack();
    });
  };

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={closeSheet}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.sheetContainerAnim, { transform: [{ translateY: slideAnim }] }]}>
        <SafeAreaView style={styles.sheetContainer} edges={['bottom']}>
          <View style={styles.dragIndicator} />
          <View style={styles.container}>
            <Text style={styles.title}>Refine Search</Text>
            
            <FilterChipGroup
              title="Distance"
              items={radiusLabels}
              activeIndices={[RADIUS_OPTIONS_KM.indexOf(draft.radiusKm)]}
              onToggle={i => setDraft(d => ({ ...d, radiusKm: RADIUS_OPTIONS_KM[i] }))}
            />
            {specialties.length > 0 && (
              <FilterChipGroup
                title="Specialty"
                items={specialties}
                activeIndices={draft.specialty ? [specialties.indexOf(draft.specialty)] : []}
                onToggle={i => setDraft(d => ({
                  ...d,
                  specialty: d.specialty === specialties[i] ? null : specialties[i],
                }))}
              />
            )}
            {hasOpeningHours && (
              <FilterSwitchRow
                title="Availability"
                label="Open Now"
                value={draft.openNow}
                onValueChange={openNow => setDraft(d => ({ ...d, openNow }))}
              />
            )}
            <FilterActionRow
              onClear={() => { resetFilters(); closeSheet(); }}
              onApply={() => { updateFilters(draft); closeSheet(); }}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheetContainerAnim: {
    width: '100%',
  },
  sheetContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  container: {
    padding: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xl,
  }
});
