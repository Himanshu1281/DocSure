import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme';

interface VitalsGridProps {
  donor: string;
  metrics: string;
}

export const VitalsGrid: React.FC<VitalsGridProps> = ({ donor, metrics }) => {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Organ Donor</Text>
        <Text style={styles.statValue}>{donor}</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Metrics</Text>
        <Text style={styles.statValue}>{metrics}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    alignItems: 'flex-start',
  },
  statLabel: {
    ...theme.typography.body,
    color: theme.colors.primaryDark,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
  }
});
