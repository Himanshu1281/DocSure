import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme';

interface DoctorAboutSectionProps {
  name: string;
  specialty: string;
  hospital: string;
  languages: string[];
}

export const DoctorAboutSection: React.FC<DoctorAboutSectionProps> = ({ name, specialty, hospital, languages }) => {
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages Spoken</Text>
        <View style={styles.chipRow}>
          {languages.map(lang => (
            <View key={lang} style={styles.chip}>
              <Text style={styles.chipText}>{lang}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          {name} is a renowned {specialty} practicing at {hospital}. 
          With an emphasis on preventative care and patient-first clinical methodology, they are part of the Clinical Mint verified network.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  aboutText: {
    ...theme.typography.body,
    lineHeight: 22,
  },
});
