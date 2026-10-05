import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormScreen, FormField, FormSection } from '../../../../core/presentation/components/FormScreen';
import { useProfileStore, ProfileData } from '../../viewmodels/useProfileStore';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { name, subtitle, phone, save } = useProfileStore();
  const [draft, setDraft] = useState<ProfileData>({ name, subtitle, phone });

  const onSave = () => {
    if (!draft.name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    save({ name: draft.name.trim(), subtitle: draft.subtitle.trim(), phone: draft.phone.trim() });
    navigation.goBack();
  };

  return (
    <FormScreen title="Edit Profile" onBack={() => navigation.goBack()} onSave={onSave}>
      <FormSection title="About You">
        <FormField label="Full name" value={draft.name} autoCapitalize="words"
          onChangeText={v => setDraft(d => ({ ...d, name: v }))} />
        <FormField label="Occupation" value={draft.subtitle}
          onChangeText={v => setDraft(d => ({ ...d, subtitle: v }))} />
        <FormField label="Phone" value={draft.phone} keyboardType="phone-pad"
          onChangeText={v => setDraft(d => ({ ...d, phone: v }))} />
      </FormSection>
    </FormScreen>
  );
};
