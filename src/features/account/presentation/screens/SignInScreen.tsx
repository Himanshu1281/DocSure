import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { useAuthStore } from '../../viewmodels/useAuthStore';

// Supabase's default minimum password length
const MIN_PASSWORD = 6;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Supabase error messages are technical; map the common ones to plain language
const friendlyError = (message: string | undefined, mode: 'signIn' | 'signUp') => {
  const m = (message ?? '').toLowerCase();
  if (m.includes('invalid login credentials')) return 'Wrong email or password.';
  if (m.includes('email not confirmed')) return 'Please confirm your email first — check your inbox for the link.';
  if (m.includes('already registered')) return 'An account with this email already exists. Sign in instead.';
  if (m.includes('rate limit')) return 'Too many attempts. Please wait a few minutes and try again.';
  if (m.includes('password')) return message!;
  return mode === 'signIn' ? 'Could not sign in. Try again.' : 'Could not create the account. Try again.';
};

export const SignInScreen = () => {
  const navigation = useNavigation();
  const { signIn, signUp, session } = useAuthStore();

  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Close once signed in
  useEffect(() => {
    if (session) navigation.goBack();
  }, [session, navigation]);

  const isSignUp = mode === 'signUp';
  const validationError =
    !isEmail(email) ? 'Enter a valid email.' :
    password.length < MIN_PASSWORD ? `Password must be at least ${MIN_PASSWORD} characters.` :
    isSignUp && password !== confirm ? 'Passwords do not match.' :
    null;

  const switchMode = () => {
    setMode(isSignUp ? 'signIn' : 'signUp');
    setError(null);
    setNotice(null);
    setConfirm('');
  };

  const submit = async () => {
    if (validationError) {
      setError(validationError);
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (isSignUp) {
        const { needsConfirmation } = await signUp(email, password);
        if (needsConfirmation) {
          setNotice('Account created. Check your email for a confirmation link, then sign in here.');
          setMode('signIn');
          setConfirm('');
        }
      } else {
        await signIn(email, password);
      }
    } catch (e: any) {
      setError(friendlyError(e?.message, mode));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoCircle}>
            <Text style={styles.logoCross}>+</Text>
          </View>
          <Text style={styles.title}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Back up your bookings and Medical ID, and use them on any device.'
              : 'Sign in to sync your bookings and Medical ID.'}
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={theme.colors.textHint}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder={isSignUp ? `At least ${MIN_PASSWORD} characters` : 'Your password'}
              placeholderTextColor={theme.colors.textHint}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              textContentType={isSignUp ? 'newPassword' : 'password'}
              returnKeyType={isSignUp ? 'next' : 'go'}
              onSubmitEditing={() => !isSignUp && !busy && submit()}
            />
            <TouchableOpacity style={styles.eye} onPress={() => setShowPassword(v => !v)} hitSlop={8}>
              <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {isSignUp && (
            <>
              <Text style={styles.label}>Confirm password</Text>
              <TextInput
                style={styles.input}
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Repeat your password"
                placeholderTextColor={theme.colors.textHint}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="go"
                onSubmitEditing={() => !busy && submit()}
              />
            </>
          )}

          {error && <Text style={styles.error}>{error}</Text>}
          {notice && <Text style={styles.notice}>{notice}</Text>}

          <TouchableOpacity
            style={[styles.primaryBtn, (busy || !!validationError) && styles.disabled]}
            disabled={busy}
            onPress={submit}
          >
            {busy
              ? <ActivityIndicator color="#FFFFFF" />
              : <Text style={styles.primaryBtnText}>{isSignUp ? 'Create account' : 'Sign in'}</Text>}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>{isSignUp ? 'Already have an account?' : 'New to DocSure?'}</Text>
            <TouchableOpacity onPress={switchMode} disabled={busy}>
              <Text style={styles.link}>{isSignUp ? 'Sign in' : 'Create account'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  container: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoCross: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginTop: -2,
  },
  title: {
    ...theme.typography.h1,
    fontSize: 26,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    marginTop: theme.spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.btn,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  passwordWrap: {
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eye: {
    position: 'absolute',
    right: theme.spacing.lg,
  },
  error: {
    color: theme.colors.danger,
    marginTop: theme.spacing.md,
    fontSize: 13,
  },
  notice: {
    color: theme.colors.primaryDark,
    marginTop: theme.spacing.md,
    fontSize: 13,
    lineHeight: 19,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.btn,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: theme.spacing.xl,
  },
  switchText: {
    color: theme.colors.textSecondary,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
