import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { confirmEmergencyCall, EMERGENCY_NUMBER } from '../../../../core/utils/linking';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

export const EmergencyAlertBox = () => {
  return (
    <TouchableOpacity style={styles.emergencyBox} onPress={confirmEmergencyCall} activeOpacity={0.8}>
      <MaterialIcons name="warning" size={24} color={theme.colors.danger} />
      <View style={styles.emergencyTextWrap}>
        <Text style={styles.emergencyTitle}>Need immediate care?</Text>
        <Text style={styles.emergencyDesc}>Tap to call emergency services ({EMERGENCY_NUMBER}).</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});
