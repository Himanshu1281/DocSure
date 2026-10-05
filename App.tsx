import React, { useState } from 'react';
import { RootNavigator } from './src/core/navigation/RootNavigator';
import { CustomSplashScreen } from './src/core/presentation/components/CustomSplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <RootNavigator />
      {showSplash && <CustomSplashScreen onFinish={() => setShowSplash(false)} />}
    </>
  );
}
