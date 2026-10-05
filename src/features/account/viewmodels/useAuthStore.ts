import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../../core/supabase/client';
import { syncAll, startWriteThrough } from '../data/cloudSync';
import { useBookingsStore } from '../../bookings/viewmodels/useBookingsStore';
import { useMedicalIdStore } from '../../medicalId/viewmodels/useMedicalIdStore';
import { useProfileStore } from '../../profile/viewmodels/useProfileStore';
import { useRecentPlacesStore } from '../../discovery/viewmodels/useRecentPlacesStore';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface AuthStore {
  isConfigured: boolean;
  isReady: boolean; // initial session check done
  session: Session | null;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  isSigningOut: boolean;

  init: () => void;
  // Resolves needsConfirmation=true when the project requires email confirmation first
  signUp: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  syncNow: () => Promise<void>;
  signOut: () => Promise<void>;
}

const persistedStores = [useBookingsStore, useMedicalIdStore, useProfileStore];

// Local data loads from AsyncStorage asynchronously; merging before it's loaded
// would treat the device as empty and overwrite nothing / push nothing
const waitForHydration = () =>
  Promise.all(persistedStores.map(store =>
    store.persist.hasHydrated()
      ? Promise.resolve()
      : new Promise<void>(resolve => {
          const unsub = store.persist.onFinishHydration(() => { unsub(); resolve(); });
        })
  ));

let stopWriteThrough: (() => void) | null = null;
let initialized = false;

const clearLocalData = () => {
  useProfileStore.getState().clear();
  useBookingsStore.getState().clear();
  useMedicalIdStore.getState().clear();
  useRecentPlacesStore.getState().clear();
};

export const useAuthStore = create<AuthStore>((set, get) => {
  const onSession = async (session: Session | null) => {
    const prevUserId = get().session?.user.id;
    set({ session, isReady: true });
    const userId = session?.user.id;
    if (userId === prevUserId) return; // token refresh, same user

    stopWriteThrough?.();
    stopWriteThrough = null;
    if (userId) {
      stopWriteThrough = startWriteThrough(userId);
      await get().syncNow();
    }
  };

  return {
    isConfigured: isSupabaseConfigured,
    isReady: !isSupabaseConfigured,
    session: null,
    syncStatus: 'idle',
    lastSyncedAt: null,
    isSigningOut: false,

    init: () => {
      if (!supabase || initialized) return;
      initialized = true;
      supabase.auth.getSession().then(({ data }) => onSession(data.session));
      supabase.auth.onAuthStateChange((_event, session) => {
        // Supabase advises not awaiting other supabase calls inside this callback
        setTimeout(() => onSession(session), 0);
      });
    },

    signUp: async (email, password) => {
      if (!supabase) throw new Error('Accounts are not configured.');
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) throw error;
      // With "Confirm email" on, Supabase returns no session until the link is clicked
      return { needsConfirmation: !data.session };
    },

    signIn: async (email, password) => {
      if (!supabase) throw new Error('Accounts are not configured.');
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      // onAuthStateChange picks up the new session and runs the first sync
    },

    syncNow: async () => {
      const userId = get().session?.user.id;
      if (!userId) return;
      set({ syncStatus: 'syncing' });
      try {
        await waitForHydration();
        await syncAll(userId);
        set({ syncStatus: 'synced', lastSyncedAt: new Date().toISOString() });
      } catch (e) {
        console.warn('Cloud sync failed:', e);
        set({ syncStatus: 'error' });
      }
    },

    signOut: async () => {
      if (get().isSigningOut) return;
      set({ isSigningOut: true });
      // Keep the loader up briefly even when sign-out is instant, so it doesn't just flicker
      const minDelay = new Promise(resolve => setTimeout(resolve, 600));
      try {
        stopWriteThrough?.();
        stopWriteThrough = null;
        if (supabase && get().session) {
          // scope 'local' signs out this device only; it clears the session even offline
          const { error } = await supabase.auth.signOut({ scope: 'local' });
          if (error) console.warn('Sign out error (local session cleared anyway):', error);
        }
        await minDelay;
        clearLocalData();
        set({ session: null, syncStatus: 'idle', lastSyncedAt: null });
      } finally {
        set({ isSigningOut: false });
      }
    },
  };
});
