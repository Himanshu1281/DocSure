import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface CustomSplashScreenProps {
  onFinish?: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onFinish }) => {
  const pulseAnim1 = useRef(new Animated.Value(0.4)).current;
  const pulseAnim2 = useRef(new Animated.Value(0.4)).current;
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation 1
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim1, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
          Animated.timing(scaleAnim1, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim1, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
          Animated.timing(scaleAnim1, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Pulse animation 2 (delayed)
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim2, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
            Animated.timing(scaleAnim2, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim2, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
            Animated.timing(scaleAnim2, { toValue: 1, duration: 2000, useNativeDriver: true }),
          ]),
        ])
      ).start();
    }, 1000);

    // Fade out and finish after 2.5 seconds
    if (onFinish) {
      setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 2500);
    }
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      {/* Background Decorators */}
      <Animated.View
        style={[
          styles.blob1,
          { opacity: pulseAnim1, transform: [{ scale: scaleAnim1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.blob2,
          { opacity: pulseAnim2, transform: [{ scale: scaleAnim2 }] },
        ]}
      />

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoWrapper}>
          <View style={styles.outerRing} />
          <View style={styles.logoContainer}>
            <MaterialIcons name="verified-user" size={54} color="#00694c" />
            <View style={styles.accentDot} />
          </View>
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleDoc}>
              Doc<Text style={styles.titleSure}>Sure</Text>
            </Text>
            <View style={styles.titleUnderline} />
          </View>
          <Text style={styles.subtitle}>FIND TRUSTED CARE NEARBY</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#f9f9f7',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  blob1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(0, 105, 76, 0.05)',
  },
  blob2: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(62, 105, 34, 0.05)',
  },
  content: {
    alignItems: 'center',
    gap: 40,
    zIndex: 10,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(0, 105, 76, 0.1)',
    transform: [{ scale: 0.95 }],
    opacity: 0.5,
  },
  logoContainer: {
    width: 112,
    height: 112,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#eeeeec',
  },
  accentDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    backgroundColor: '#00694c',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  textSection: {
    alignItems: 'center',
    gap: 12,
  },
  titleWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  titleDoc: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1a1c1b',
    letterSpacing: -0.5,
  },
  titleSure: {
    color: '#00694c',
  },
  titleUnderline: {
    height: 4,
    width: 48,
    backgroundColor: 'rgba(0, 105, 76, 0.2)',
    borderRadius: 2,
  },
  subtitle: {
    color: 'rgba(61, 73, 67, 0.6)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});
