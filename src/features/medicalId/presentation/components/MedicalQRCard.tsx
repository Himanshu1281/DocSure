import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

export const MedicalQRCard = () => {
  return (
    <View style={styles.qrCard}>
      <MaterialIcons name="qr-code-2" size={120} color={theme.colors.primaryDark} />
      <Text style={styles.qrTitle}>Emergency Access QR</Text>
      <Text style={styles.qrDesc}>Dossier ID: CC-7729-LX</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  qrCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.card,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  qrTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.primaryDark,
    marginTop: theme.spacing.md,
    marginBottom: 4,
  },
  qrDesc: {
    ...theme.typography.body,
  },
});
