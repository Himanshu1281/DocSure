import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

export const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>ER</Text>
          </View>
          <Text style={styles.name}>Dr. Elena Rostova</Text>
          <Text style={styles.subtitle}>Senior Clinical Researcher</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 4.2.0 (Clinical Build)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.menuRow}>
            <MaterialIcons name="settings" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Preferences</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textHint} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow}>
            <MaterialIcons name="payment" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Billing & Payments</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textHint} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.menuRow}>
            <MaterialIcons name="privacy-tip" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textHint} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow}>
            <MaterialIcons name="description" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Terms of Service</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textHint} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    padding: theme.spacing.xl,
    paddingBottom: 100,
  },
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
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
  logoutBtn: {
    marginTop: theme.spacing.xl,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: theme.radius.btn,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: 16,
  }
});
