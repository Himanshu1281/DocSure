import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../../core/theme';

interface DoctorTagsProps {
  languages: string[];
  waitTime: string;
}

export const DoctorTags: React.FC<DoctorTagsProps> = ({ languages, waitTime }) => {
  return (
    <View style={styles.tagsRow}>
      {languages.map(lang => (
        <View key={lang} style={styles.tag}>
          <Text style={styles.tagText}>{lang}</Text>
        </View>
      ))}
      <View style={styles.tag}>
        <Text style={styles.tagText}>Wait: {waitTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  tag: {
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
  },
  tagText: {
    color: theme.colors.textHint,
    ...theme.typography.tag,
  },
});
