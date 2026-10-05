import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

interface DoctorActionFooterProps {
  onDirections: () => void;
  onCall?: () => void;
  onBook: () => void;
}

export const DoctorActionFooter: React.FC<DoctorActionFooterProps> = ({ onDirections, onCall, onBook }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.secondaryBtn} onPress={onDirections}>
        <MaterialIcons name="directions" size={18} color={theme.colors.primary} />
        <Text style={styles.secondaryBtnText} numberOfLines={1} adjustsFontSizeToFit>Directions</Text>
      </TouchableOpacity>
      {onCall && (
        <TouchableOpacity style={styles.secondaryBtn} onPress={onCall}>
          <MaterialIcons name="call" size={18} color={theme.colors.primary} />
          <Text style={styles.secondaryBtnText} numberOfLines={1} adjustsFontSizeToFit>Call</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.primaryBtn} onPress={onBook}>
        <Text style={styles.primaryBtnText} numberOfLines={1} adjustsFontSizeToFit>Book Consult</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.btn,
    paddingVertical: 12,
    gap: 4,
    paddingHorizontal: 4,
  },
  secondaryBtnText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  primaryBtn: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.btn,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  primaryBtnText: {
    color: theme.colors.surface,
    fontWeight: '600',
    fontSize: 15,
  }
});
