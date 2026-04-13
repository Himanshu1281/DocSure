import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../core/navigation/RootNavigator';
import { useDiscoveryViewModel } from '../../viewmodels/useDiscoveryViewModel';
import { Navbar } from '../components/Navbar';
import { FilterBar } from '../components/FilterBar';
import { MapPanel } from '../components/MapPanel';
import { DoctorCard } from '../components/DoctorCard';
import { theme } from '../../../../core/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DiscoveryScreen = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768; // For split-pane logic
  const navigation = useNavigation<NavigationProp>();
  
  const { 
    doctors, 
    isLoadingDoctors, 
    userLocation, 
    loadLocation, 
    selectedDoctorId, 
    setSelectedDoctor 
  } = useDiscoveryViewModel();

  useEffect(() => {
    loadLocation();
  }, []);

  const handleBook = (doctorId: string) => {
    navigation.navigate('DoctorDetail', { id: doctorId });
  };

  const renderContent = () => {
    // Mobile Layout
    if (!isDesktop) {
      return (
        <View style={styles.mobileContainer}>
          <View style={styles.mapWrapperMobile}>
            <MapPanel 
              doctors={doctors}
              selectedDoctorId={selectedDoctorId}
              onMarkerPress={setSelectedDoctor}
              userLocation={userLocation}
            />
          </View>
          <FlatList
            data={doctors}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <DoctorCard 
                doctor={item}
                isActive={selectedDoctorId === item.id}
                onPress={() => setSelectedDoctor(item.id)}
                onBook={() => handleBook(item.id)}
              />
            )}
          />
        </View>
      );
    }

    // Desktop/Tablet Layout
    return (
      <View style={styles.desktopContainer}>
        <View style={styles.listPanelDesktop}>
          <FlatList
            data={doctors}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <DoctorCard 
                doctor={item}
                isActive={selectedDoctorId === item.id}
                onPress={() => setSelectedDoctor(item.id)}
                onBook={() => handleBook(item.id)}
              />
            )}
          />
        </View>
        <View style={styles.mapPanelDesktop}>
          <MapPanel 
            doctors={doctors}
            selectedDoctorId={selectedDoctorId}
            onMarkerPress={setSelectedDoctor}
            userLocation={userLocation}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Navbar city={userLocation.city} isLoading={userLocation.isLoading} />
      <FilterBar onOpenFilters={() => navigation.navigate('FilterSheet')} resultCount={doctors.length} />
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  mobileContainer: {
    flex: 1,
  },
  mapWrapperMobile: {
    height: 280,
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listPanelDesktop: {
    width: 420,
    borderRightWidth: 0.5,
    borderRightColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
  },
  mapPanelDesktop: {
    flex: 1,
  }
});
