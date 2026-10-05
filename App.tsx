import React, { useEffect, useState } from 'react';
import { RootNavigator } from './src/core/navigation/RootNavigator';
import { CustomSplashScreen } from './src/core/presentation/components/CustomSplashScreen';
import { useAuthStore } from './src/features/account/viewmodels/useAuthStore';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Restore the Supabase session (if any) and start cloud sync
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  return (
    <>
      <RootNavigator />
      {showSplash && <CustomSplashScreen onFinish={() => setShowSplash(false)} />}
    </>
  );
}
