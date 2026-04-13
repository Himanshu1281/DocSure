import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../../core/theme';

interface DoctorHeaderProps {
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  isVerified: boolean;
}

import { getInitials } from '../../../utils/getInitials';

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({ name, specialty, hospital, rating, isVerified }) => {

  const specKey = Object.keys(theme.colors.specialtyBackgrounds).find(k => k === specialty) || 'General Physician';
  // @ts-ignore
  const avatarBg = theme.colors.specialtyBackgrounds[specKey];
  // @ts-ignore
  const avatarText = theme.colors.specialtyTexts[specKey];

  return (
    <View style={styles.headerRow}>
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={[styles.avatarText, { color: avatarText }]}>{getInitials(name)}</Text>
      </View>
      <View style={styles.headerInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>
        <Text style={styles.specialty}>{specialty} · {hospital}</Text>
      </View>
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>★ {rating}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  name: {
    ...theme.typography.doctorName,
    marginRight: theme.spacing.sm,
  },
  verifiedBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
  },
  verifiedText: {
    fontSize: 10,
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
  specialty: {
    ...theme.typography.body,
  },
  ratingBadge: {
    backgroundColor: theme.colors.ratingBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.btn,
    marginLeft: theme.spacing.sm,
  },
  ratingText: {
    color: theme.colors.ratingGreen,
    fontSize: 11,
    fontWeight: '600',
  },
});
