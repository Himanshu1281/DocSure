import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

interface DoctorProfileHeaderProps {
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  isVerified: boolean;
}

export const DoctorProfileHeader: React.FC<DoctorProfileHeaderProps> = ({ name, specialty, hospital, rating, isVerified }) => {
  return (
    <View style={styles.profileBox}>
      <View style={styles.avatarLarge}>
        <Text style={styles.avatarText}>{name.charAt(4)}</Text>
      </View>
      <Text style={styles.doctorName}>{name}</Text>
      <Text style={styles.specialty}>{specialty} · {hospital}</Text>
      
      <View style={styles.ratingRow}>
        <MaterialIcons name="star" size={16} color={theme.colors.primaryDark} />
        <Text style={styles.ratingText}>{rating}</Text>
        {isVerified && (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={12} color={theme.colors.primaryDark} />
            <Text style={styles.verifiedText}>Verified Curator</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileBox: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
  },
  doctorName: {
    ...theme.typography.h1,
    marginBottom: 4,
  },
  specialty: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.md,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
});
