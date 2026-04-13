import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme';

interface DoctorStatsGridProps {
  waitTime: string;
  distance: number;
  fee: number;
}

export const DoctorStatsGrid: React.FC<DoctorStatsGridProps> = ({ waitTime, distance, fee }) => {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Wait Time</Text>
        <Text style={styles.statValue}>{waitTime}</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Distance</Text>
        <Text style={styles.statValue}>{distance} km</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Consult Fee</Text>
        <Text style={styles.statValue}>₹{fee}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
});
