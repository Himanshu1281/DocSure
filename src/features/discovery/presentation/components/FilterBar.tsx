import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';

interface FilterBarProps {
  onOpenFilters: () => void;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onOpenFilters, resultCount }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.pill} onPress={onOpenFilters}>
          <Text style={styles.pillText}>All Specialties ▾</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.pill} onPress={onOpenFilters}>
          <Text style={styles.pillText}>All Languages ▾</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pill} onPress={onOpenFilters}>
          <Text style={styles.pillText}>Max: ₹2000 ▾</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.pill, styles.pillToggle]} onPress={onOpenFilters}>
          <Text style={styles.pillToggleText}>Open Now</Text>
        </TouchableOpacity>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{resultCount} results</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: 10,
    alignItems: 'center',
  },
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
    fontSize: 13,
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.btn,
    backgroundColor: theme.colors.surface,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    marginLeft: theme.spacing.sm,
  },
  countText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  }
});
