import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme';

interface BookingsStatsRowProps {
  total: number;
  upcoming: number;
}

export const BookingsStatsRow: React.FC<BookingsStatsRowProps> = ({ total, upcoming }) => {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Total Bookings</Text>
        <Text style={styles.statValue}>{total}</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Upcoming</Text>
        <Text style={styles.statValue}>{upcoming < 10 ? `0${upcoming}` : upcoming}</Text>
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
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    alignItems: 'center',
  },
  statLabel: {
    ...theme.typography.body,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
  }
});
