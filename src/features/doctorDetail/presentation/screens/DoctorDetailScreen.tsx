import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { callNumber, openDirections } from '../../../../core/utils/linking';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { RootStackParamList } from '../../../../core/navigation/RootNavigator';
import { Doctor } from '../../../discovery/domain/entities/Doctor';
import { doctorRepository } from '../../../discovery/data/doctorRepository';
import { useDiscoveryViewModel, getSearchCenter } from '../../../discovery/viewmodels/useDiscoveryViewModel';

import { DoctorProfileHeader } from '../components/DoctorProfileHeader';
import { DoctorStatsGrid } from '../components/DoctorStatsGrid';
import { DoctorAboutSection } from '../components/DoctorAboutSection';
import { DoctorActionFooter } from '../components/DoctorActionFooter';

type DoctorDetailRouteProp = RouteProp<RootStackParamList, 'DoctorDetail'>;

export const DoctorDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DoctorDetailRouteProp>();
  
  const id = route.params?.id;
  const cached = useDiscoveryViewModel(state => state.doctors.find(d => d.id === id));
  const userLocation = useDiscoveryViewModel(state => state.userLocation);
  const searchLocation = useDiscoveryViewModel(state => state.searchLocation);
  const [fetched, setFetched] = useState<Doctor | null>(null);
  const [notFound, setNotFound] = useState(false);
  const doctor = cached ?? fetched;

  // Deep links / app restarts won't have the doctor in the discovery list, so fetch it
  useEffect(() => {
    if (cached || !id) return;
    // Distance is measured from wherever the user is searching around
    const origin = getSearchCenter({ searchLocation, userLocation });
    doctorRepository.getById(id, origin)
      .then(d => (d ? setFetched(d) : setNotFound(true)))
      .catch(() => setNotFound(true));
  }, [id, cached]);

  const header = (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Curator Profile</Text>
      <View style={styles.headerRight} />
    </View>
  );

  if (!doctor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {header}
        <View style={styles.centered}>
          {notFound
            ? <Text style={styles.headerTitle}>Doctor not found</Text>
            : <ActivityIndicator color={theme.colors.primary} />}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {header}

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
          isVerified={doctor.isVerified}
          address={doctor.address}
          phone={doctor.phone}
        />
      </ScrollView>

      <DoctorActionFooter
        onDirections={() => openDirections(doctor.latitude, doctor.longitude, doctor.name)}
        onCall={doctor.phone ? () => callNumber(doctor.phone!) : undefined}
        onBook={() => navigation.navigate('BookAppointment', {
          doctorId: doctor.id,
          doctor: {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            hospital: doctor.hospital,
            phone: doctor.phone,
            latitude: doctor.latitude,
            longitude: doctor.longitude,
          },
        })}
      />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
});

