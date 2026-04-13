import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';

interface FilterActionRowProps {
  onClear: () => void;
  onApply: () => void;
}

export const FilterActionRow: React.FC<FilterActionRowProps> = ({ onClear, onApply }) => {
  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.clearButton} onPress={onClear}>
        <Text style={styles.clearText}>Clear All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.applyButton} onPress={onApply}>
        <Text style={styles.applyText}>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.btn,
  },
  clearText: {
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.btn,
  },
  applyText: {
    color: theme.colors.surface,
    fontWeight: '600',
  }
});
