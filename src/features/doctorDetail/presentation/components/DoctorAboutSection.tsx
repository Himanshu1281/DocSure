import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme';

interface DoctorAboutSectionProps {
  name: string;
  specialty: string;
  hospital: string;
  languages: string[];
  isVerified: boolean;
  address: string | null;
  phone: string | null;
}

export const DoctorAboutSection: React.FC<DoctorAboutSectionProps> = ({
  name, specialty, hospital, languages, isVerified, address, phone,
}) => {
  return (
    <>
      {languages.length > 0 && (
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
      )}

      {(address || phone) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          {address && <Text style={styles.aboutText}>{address}</Text>}
          {phone && <Text style={styles.aboutText}>{phone}</Text>}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          {isVerified
            ? `${name} is a ${specialty} practicing at ${hospital}, and is part of the DocSure verified network.`
            : `${name} (${specialty}) has not yet claimed this listing. Fees and availability will appear once the practice is verified on DocSure.`}
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
