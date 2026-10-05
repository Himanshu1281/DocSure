import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

interface UpcomingBookingCardProps {
  doctorName: string;
  specialty: string;
  dateTime: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}

export const UpcomingBookingCard: React.FC<UpcomingBookingCardProps> = ({ doctorName, specialty, dateTime, iconName, onPress, onReschedule, onCancel }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress} disabled={!onPress}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
        </View>
        <View style={styles.iconCircle}>
          <MaterialIcons name={iconName} size={20} color={theme.colors.primary} />
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.dateTime}>{dateTime}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onCancel}>
            <Text style={[styles.actionBtnText, styles.cancelText]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onReschedule}>
            <Text style={styles.actionBtnText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  doctorName: {
    ...theme.typography.doctorName,
    marginBottom: 4,
  },
  specialty: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  dateTime: {
    ...theme.typography.body,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  cancelText: {
    color: theme.colors.danger,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.btn,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
});
