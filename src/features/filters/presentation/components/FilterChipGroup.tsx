import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';

interface FilterChipGroupProps {
  title: string;
  items: string[];
  activeIndices: number[];
}

export const FilterChipGroup: React.FC<FilterChipGroupProps> = ({ title, items, activeIndices }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipRow}>
        {items.map((item, i) => {
          const isActive = activeIndices.includes(i);
          return (
            <TouchableOpacity key={item} style={[styles.chip, isActive && styles.chipActive]}>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
  },
  chipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  chipTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
});
