import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { theme } from '../../../../core/theme';

interface FilterSwitchRowProps {
  title: string;
  label: string;
  value: boolean;
  onValueChange?: (val: boolean) => void;
}

export const FilterSwitchRow: React.FC<FilterSwitchRowProps> = ({ title, label, value, onValueChange }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ true: theme.colors.primaryLight }} 
          thumbColor={theme.colors.primary} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  switchLabel: {
    ...theme.typography.body,
    fontSize: 14,
  },
});
