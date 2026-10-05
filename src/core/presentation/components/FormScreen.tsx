import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, TextInputProps,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface FormScreenProps {
  title: string;
  onBack: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

// Header with back + Save, scrollable body that stays clear of the keyboard
export const FormScreen: React.FC<FormScreenProps> = ({ title, onBack, onSave, children }) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerBtn} onPress={onBack}>
        <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.headerBtn} onPress={onSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

interface FormFieldProps extends TextInputProps {
  label: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, style, ...inputProps }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={theme.colors.textHint}
      {...inputProps}
    />
  </View>
);

export const FormSection: React.FC<{ title: string; onAdd?: () => void; children: React.ReactNode }> = ({
  title, onAdd, children,
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onAdd && (
        <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
          <MaterialIcons name="add" size={18} color={theme.colors.primary} />
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

export const RemovableCard: React.FC<{ onRemove: () => void; children: React.ReactNode }> = ({
  onRemove, children,
}) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.removeBtn} onPress={onRemove} hitSlop={8}>
      <MaterialIcons name="close" size={18} color={theme.colors.textSecondary} />
    </TouchableOpacity>
    {children}
  </View>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerBtn: {
    padding: theme.spacing.xs,
    minWidth: 40,
  },
  headerTitle: {
    ...theme.typography.h2,
    fontSize: 16,
  },
  saveText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'right',
  },
  container: {
    padding: theme.spacing.xl,
    paddingBottom: 60,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  addText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  field: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.btn,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  card: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
