import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

interface MedicationListItemProps {
  name: string;
  frequency: string;
  isLast?: boolean;
}

export const MedicationListItem: React.FC<MedicationListItemProps> = ({ name, frequency, isLast }) => {
  return (
    <View style={[styles.medRow, isLast && styles.medRowNoBorder]}>
      <MaterialIcons name="medication" size={20} color={theme.colors.primary} />
      <View style={styles.medInfo}>
        <Text style={styles.medName}>{name}</Text>
        <Text style={styles.medFreq}>{frequency}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  medRowNoBorder: {
    borderBottomWidth: 0,
  },
  medInfo: {
    marginLeft: theme.spacing.md,
  },
  medName: {
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  medFreq: {
    ...theme.typography.body,
  },
});
