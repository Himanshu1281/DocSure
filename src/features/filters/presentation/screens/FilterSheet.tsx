import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../../core/theme';

import { FilterChipGroup } from '../components/FilterChipGroup';
import { FilterSwitchRow } from '../components/FilterSwitchRow';
import { FilterActionRow } from '../components/FilterActionRow';

export const FilterSheet = () => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
              title="Specialty" 
              items={['General Physician', 'Dermatologist', 'Orthopedic', 'Cardiologist']} 
              activeIndices={[0]} 
            />

            <FilterChipGroup 
              title="Language" 
              items={['English', 'Hindi', 'Marathi', 'Telugu']} 
              activeIndices={[0, 1]} 
            />
            
            <FilterSwitchRow 
              title="Availability" 
              label="Open Now" 
              value={true} 
            />

            <FilterActionRow 
              onClear={closeSheet} 
              onApply={closeSheet} 
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
    ...StyleSheet.absoluteFillObject,
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
