import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Doctor } from '../../../domain/entities/Doctor';
import { theme } from '../../../../../core/theme';
import { DoctorHeader } from './DoctorHeader';
import { DoctorTags } from './DoctorTags';
import { DoctorFooter } from './DoctorFooter';

interface DoctorCardProps {
  doctor: Doctor;
  isActive: boolean;
  onPress: () => void;
  onBook: () => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isActive, onPress, onBook }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, isActive && styles.cardActive]}
    >
      <DoctorHeader 
        name={doctor.name}
        specialty={doctor.specialty}
        hospital={doctor.hospital}
        rating={doctor.rating}
        isVerified={doctor.isVerified}
      />

      <DoctorTags 
        languages={doctor.languages}
        waitTime={doctor.waitTime}
      />

      <View style={styles.divider} />

      <DoctorFooter 
        consultationFee={doctor.consultationFee}
        distance={doctor.distance}
        city={doctor.city}
        onBook={onBook}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardActive: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    backgroundColor: '#FAFFFE',
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.border,
    marginHorizontal: -theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
});
