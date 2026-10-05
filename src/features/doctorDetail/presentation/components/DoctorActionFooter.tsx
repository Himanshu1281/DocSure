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
        <MaterialIcons name="directions" size={20} color={theme.colors.primary} />
        <Text style={styles.secondaryBtnText}>Directions</Text>
      </TouchableOpacity>
      {onCall && (
        <TouchableOpacity style={styles.secondaryBtn} onPress={onCall}>
          <MaterialIcons name="call" size={20} color={theme.colors.primary} />
          <Text style={styles.secondaryBtnText}>Call</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.primaryBtn} onPress={onBook}>
        <Text style={styles.primaryBtnText}>Book Consult</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.md,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.btn,
    paddingVertical: 14,
    gap: 8,
  },
  secondaryBtnText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  primaryBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.btn,
    paddingVertical: 14,
  },
  primaryBtnText: {
    color: theme.colors.surface,
    fontWeight: '600',
    fontSize: 16,
  }
});
