import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../../core/theme';

interface DoctorFooterProps {
  consultationFee: number;
  distance: number;
  city: string;
  onBook: () => void;
}

export const DoctorFooter: React.FC<DoctorFooterProps> = ({ consultationFee, distance, city, onBook }) => {
  return (
    <>
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.feeLabel}>Consultation Fee</Text>
          <Text style={styles.feeAmount}>₹{consultationFee}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={onBook}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.distanceText}>📍 {distance} km away · {city}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  feeLabel: {
    ...theme.typography.feeSublabel,
  },
  feeAmount: {
    ...theme.typography.fee,
  },
  bookButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.btn,
  },
  bookButtonText: {
    color: theme.colors.primaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  }
});
