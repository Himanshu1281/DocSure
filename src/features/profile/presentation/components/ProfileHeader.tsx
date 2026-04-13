import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme';

interface ProfileHeaderProps {
  initials: string;
  name: string;
  subtitle: string;
  version: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ initials, name, subtitle, version }) => {
  return (
    <View style={styles.header}>
      <View style={styles.avatarLarge}>
        <Text style={styles.avatarTextLarge}>{initials}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.versionBadge}>
        <Text style={styles.versionText}>{version}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarTextLarge: {
    fontSize: 28,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  name: {
    ...theme.typography.h1,
    marginBottom: 4,
  },
  subtitle: {
    ...theme.typography.body,
    marginBottom: theme.spacing.md,
  },
  versionBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  versionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
