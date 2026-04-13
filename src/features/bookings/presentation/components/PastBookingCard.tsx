import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme';

interface PastBookingCardProps {
  doctorName: string;
  specialty: string;
  date: string;
}

export const PastBookingCard: React.FC<PastBookingCardProps> = ({ doctorName, specialty, date }) => {
  return (
    <View style={styles.pastCard}>
      <View>
        <Text style={styles.doctorName}>{doctorName}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
      </View>
      <Text style={styles.pastDate}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pastCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  doctorName: {
    ...theme.typography.doctorName,
    marginBottom: 4,
  },
  specialty: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  pastDate: {
    ...theme.typography.body,
  },
});
