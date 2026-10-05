import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';

interface ContactListItemProps {
  name: string;
  relation: string;
  onCall?: () => void;
}

export const ContactListItem: React.FC<ContactListItemProps> = ({ name, relation, onCall }) => {
  return (
    <TouchableOpacity style={styles.contactRow} onPress={onCall} disabled={!onCall}>
      <View>
        <Text style={styles.contactName}>{name}</Text>
        <Text style={styles.contactRelation}>{relation}</Text>
      </View>
      <MaterialIcons name="phone" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  contactName: {
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  contactRelation: {
    ...theme.typography.body,
  },
});
