import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../../core/theme';

interface FilterPillProps {
  label: string;
  isToggled?: boolean;
  onPress: () => void;
}

export const FilterPill: React.FC<FilterPillProps> = ({ label, isToggled, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.pill, isToggled && styles.pillToggle]} 
      onPress={onPress}
    >
      <Text style={[styles.pillText, isToggled && styles.pillToggleText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.btn,
    backgroundColor: theme.colors.surface,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  pillText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  pillToggle: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  pillToggleText: {
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
});
