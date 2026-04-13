import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { RootStackParamList } from '../../../../core/navigation/RootNavigator';
import { mockDoctors } from '../../../../features/discovery/data/datasources/MockDoctorDataSource';

import { DoctorProfileHeader } from '../components/DoctorProfileHeader';
import { DoctorStatsGrid } from '../components/DoctorStatsGrid';
import { DoctorAboutSection } from '../components/DoctorAboutSection';
import { DoctorActionFooter } from '../components/DoctorActionFooter';

type DoctorDetailRouteProp = RouteProp<RootStackParamList, 'DoctorDetail'>;

export const DoctorDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<DoctorDetailRouteProp>();
  
  const doctor = mockDoctors.find(d => d.id === route.params?.id) || mockDoctors[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Curator Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <DoctorProfileHeader 
          name={doctor.name}
          specialty={doctor.specialty}
          hospital={doctor.hospital}
          rating={doctor.rating}
          isVerified={doctor.isVerified}
        />

        <DoctorStatsGrid 
          waitTime={doctor.waitTime}
          distance={doctor.distance}
          fee={doctor.consultationFee}
        />

        <DoctorAboutSection 
          name={doctor.name}
          specialty={doctor.specialty}
          hospital={doctor.hospital}
          languages={doctor.languages}
        />
      </ScrollView>

      <DoctorActionFooter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h2,
    fontSize: 16,
  },
  headerRight: {
    width: 32,
  },
  container: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
});

