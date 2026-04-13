import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../../core/theme';
import { FilterPill } from './FilterPill';

interface FilterBarProps {
  onOpenFilters: () => void;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onOpenFilters, resultCount }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <FilterPill label="All Specialties ▾" onPress={onOpenFilters} />
        <FilterPill label="All Languages ▾" onPress={onOpenFilters} />
        <FilterPill label="Max: ₹2000 ▾" onPress={onOpenFilters} />
        <FilterPill label="Open Now" isToggled={true} onPress={onOpenFilters} />

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
    flexDirection: 'row',
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
