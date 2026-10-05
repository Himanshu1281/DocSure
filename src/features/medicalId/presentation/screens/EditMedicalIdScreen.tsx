import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../../core/theme';
import { FormScreen, FormField, FormSection, RemovableCard } from '../../../../core/presentation/components/FormScreen';
import { useMedicalIdStore, MedicalIdData, newRowId } from '../../viewmodels/useMedicalIdStore';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const EditMedicalIdScreen = () => {
  const navigation = useNavigation();
  const store = useMedicalIdStore();
  const [draft, setDraft] = useState<MedicalIdData>({
    bloodGroup: store.bloodGroup,
    allergies: store.allergies,
    organDonor: store.organDonor,
    heightCm: store.heightCm,
    weightKg: store.weightKg,
    medications: store.medications,
    contacts: store.contacts,
  });

  const update = (patch: Partial<MedicalIdData>) => setDraft(d => ({ ...d, ...patch }));

  const save = () => {
    const contacts = draft.contacts.filter(c => c.name.trim() || c.phone.trim());
    if (contacts.some(c => !c.phone.trim())) {
      Alert.alert('Missing phone number', 'Every emergency contact needs a phone number.');
      return;
    }
    store.save({
      ...draft,
      medications: draft.medications.filter(m => m.name.trim()),
      contacts,
    });
    navigation.goBack();
  };

  return (
    <FormScreen title="Edit Medical ID" onBack={() => navigation.goBack()} onSave={save}>
      <FormSection title="Blood Group">
        <View style={styles.chipRow}>
          {BLOOD_GROUPS.map(g => {
            const active = draft.bloodGroup === g;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => update({ bloodGroup: active ? '' : g })}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </FormSection>

      <FormSection title="Vitals">
        <View style={styles.row}>
          <View style={styles.flex}>
            <FormField label="Height (cm)" keyboardType="numeric" value={draft.heightCm}
              onChangeText={heightCm => update({ heightCm })} placeholder="170" />
          </View>
          <View style={styles.flex}>
            <FormField label="Weight (kg)" keyboardType="numeric" value={draft.weightKg}
              onChangeText={weightKg => update({ weightKg })} placeholder="70" />
          </View>
        </View>
        <Text style={styles.label}>Organ Donor</Text>
        <View style={styles.chipRow}>
          {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map(o => {
            const active = draft.organDonor === o.value;
            return (
              <TouchableOpacity
                key={o.label}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => update({ organDonor: active ? null : o.value })}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{o.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </FormSection>

      <FormSection title="Allergies">
        <FormField label="Known allergies" value={draft.allergies} multiline
          onChangeText={allergies => update({ allergies })} placeholder="e.g. Penicillin, peanuts" />
      </FormSection>

      <FormSection
        title="Current Medications"
        onAdd={() => update({ medications: [...draft.medications, { id: newRowId(), name: '', frequency: '' }] })}
      >
        {draft.medications.length === 0 && <Text style={styles.hint}>No medications added.</Text>}
        {draft.medications.map(m => (
          <RemovableCard key={m.id} onRemove={() => update({ medications: draft.medications.filter(x => x.id !== m.id) })}>
            <FormField label="Medication" value={m.name} placeholder="Metformin 500mg"
              onChangeText={name => update({ medications: draft.medications.map(x => x.id === m.id ? { ...x, name } : x) })} />
            <FormField label="Frequency" value={m.frequency} placeholder="Twice daily"
              onChangeText={frequency => update({ medications: draft.medications.map(x => x.id === m.id ? { ...x, frequency } : x) })} />
          </RemovableCard>
        ))}
      </FormSection>

      <FormSection
        title="Emergency Contacts"
        onAdd={() => update({ contacts: [...draft.contacts, { id: newRowId(), name: '', relation: '', phone: '' }] })}
      >
        {draft.contacts.length === 0 && <Text style={styles.hint}>No emergency contacts added.</Text>}
        {draft.contacts.map(c => (
          <RemovableCard key={c.id} onRemove={() => update({ contacts: draft.contacts.filter(x => x.id !== c.id) })}>
            <FormField label="Name" value={c.name}
              onChangeText={name => update({ contacts: draft.contacts.map(x => x.id === c.id ? { ...x, name } : x) })} />
            <FormField label="Relation" value={c.relation} placeholder="Spouse, parent, physician…"
              onChangeText={relation => update({ contacts: draft.contacts.map(x => x.id === c.id ? { ...x, relation } : x) })} />
            <FormField label="Phone" value={c.phone} keyboardType="phone-pad"
              onChangeText={phone => update({ contacts: draft.contacts.map(x => x.id === c.id ? { ...x, phone } : x) })} />
          </RemovableCard>
        ))}
      </FormSection>
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  hint: {
    ...theme.typography.body,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
