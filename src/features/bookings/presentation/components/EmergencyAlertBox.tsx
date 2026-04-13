import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

export const EmergencyAlertBox = () => {
  return (
    <View style={styles.emergencyBox}>
      <MaterialIcons name="warning" size={24} color={theme.colors.danger} />
      <View style={styles.emergencyTextWrap}>
        <Text style={styles.emergencyTitle}>Need immediate care?</Text>
        <Text style={styles.emergencyDesc}>Our clinical curators are available for emergency virtual consultations 24/7.</Text>
      </View>
    </View>
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
