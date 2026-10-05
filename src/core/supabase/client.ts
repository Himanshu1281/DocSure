import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

// Accept the dashboard's "REST URL" too: the client adds /rest/v1 and /auth/v1 itself
const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/(rest|auth)\/v1\/?$/, '').replace(/\/$/, '');
// The anon (publishable) key is meant to ship in apps; Row Level Security protects the data
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase env vars not set — accounts and cloud sync are disabled.');
}

// null when not configured, so the app keeps working fully offline
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Only refresh tokens while the app is in the foreground
// https://supabase.com/docs/guides/auth/quickstarts/react-native
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', state => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
