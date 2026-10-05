import { Alert, Linking, Platform } from 'react-native';

export const EMERGENCY_NUMBER = '112';

export const callNumber = async (phone: string) => {
  const url = `tel:${phone.replace(/[^\d+]/g, '')}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Cannot place call', `Please dial ${phone} manually.`);
  }
};

export const confirmEmergencyCall = () => {
  Alert.alert(
    'Call emergency services?',
    `This will dial ${EMERGENCY_NUMBER}.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: `Call ${EMERGENCY_NUMBER}`, style: 'destructive', onPress: () => callNumber(EMERGENCY_NUMBER) },
    ]
  );
};

export const openDirections = async (latitude: number, longitude: number, label: string) => {
  const encoded = encodeURIComponent(label);
  const native = Platform.select({
    ios: `maps:0,0?q=${encoded}&ll=${latitude},${longitude}`,
    default: `geo:0,0?q=${latitude},${longitude}(${encoded})`,
  });
  const web = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  try {
    await Linking.openURL(native);
  } catch {
    await Linking.openURL(web);
  }
};
