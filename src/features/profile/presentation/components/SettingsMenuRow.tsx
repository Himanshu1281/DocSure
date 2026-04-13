import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

interface SettingsMenuRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress?: () => void;
}

export const SettingsMenuRow: React.FC<SettingsMenuRowProps> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color={theme.colors.textSecondary} />
      <Text style={styles.menuText}>{title}</Text>
      <MaterialIcons name="chevron-right" size={24} color={theme.colors.textHint} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  menuText: {
    flex: 1,
    marginLeft: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
});
