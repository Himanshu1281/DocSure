import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Doctor } from '../../domain/entities/Doctor';
import { theme } from '../../../../core/theme';

interface DoctorCardProps {
  doctor: Doctor;
  isActive: boolean;
  onPress: () => void;
  onBook: () => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isActive, onPress, onBook }) => {
  const getInitials = (name: string) => {
    const parts = name.replace('Dr. ', '').split(' ');
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
  };

  const specKey = Object.keys(theme.colors.specialtyBackgrounds).find(k => k === doctor.specialty) || 'General Physician';
  // @ts-ignore
  const avatarBg = theme.colors.specialtyBackgrounds[specKey];
  // @ts-ignore
  const avatarText = theme.colors.specialtyTexts[specKey];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, isActive && styles.cardActive]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={[styles.avatarText, { color: avatarText }]}>{getInitials(doctor.name)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{doctor.name}</Text>
            {doctor.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.specialty}>{doctor.specialty} · {doctor.hospital}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {doctor.rating}</Text>
        </View>
      </View>

      <View style={styles.tagsRow}>
        {doctor.languages.map(lang => (
          <View key={lang} style={styles.tag}>
            <Text style={styles.tagText}>{lang}</Text>
          </View>
        ))}
        <View style={styles.tag}>
          <Text style={styles.tagText}>Wait: {doctor.waitTime}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.feeLabel}>Consultation Fee</Text>
          <Text style={styles.feeAmount}>₹{doctor.consultationFee}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={onBook}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.distanceText}>📍 {doctor.distance} km away · {doctor.city}</Text>
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  tag: {
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
  },
  tagText: {
    color: theme.colors.textHint,
    ...theme.typography.tag,
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.border,
    marginHorizontal: -theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
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
