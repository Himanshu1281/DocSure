import React, { useCallback, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../core/navigation/RootNavigator';
import { useDiscoveryViewModel, applyFilters, getSearchCenter } from '../../viewmodels/useDiscoveryViewModel';
import { Navbar } from '../components/Navbar';
import { FilterBar } from '../components/FilterBar';
import { MapPanel } from '../components/MapPanel';
import { DoctorCard } from '../components/DoctorCard';
import { Doctor } from '../../domain/entities/Doctor';
import { theme } from '../../../../core/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DiscoveryScreen = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768; // For split-pane logic
  const navigation = useNavigation<NavigationProp>();
  
  const { 
    doctors: allDoctors,
    filters,
    updateFilters,
    isLoadingDoctors,
    doctorsError,
    loadDoctors,
    userLocation, 
    searchLocation,
    loadLocation, 
    selectedDoctorId, 
    setSelectedDoctor 
  } = useDiscoveryViewModel(useShallow(state => ({
    doctors: state.doctors,
    filters: state.filters,
    updateFilters: state.updateFilters,
    isLoadingDoctors: state.isLoadingDoctors,
    doctorsError: state.doctorsError,
    loadDoctors: state.loadDoctors,
    userLocation: state.userLocation,
    searchLocation: state.searchLocation,
    loadLocation: state.loadLocation,
    selectedDoctorId: state.selectedDoctorId,
    setSelectedDoctor: state.setSelectedDoctor,
  })));

  const doctors = useMemo(() => applyFilters(allDoctors, filters), [allDoctors, filters]);

  // Stable object so memoized children don't re-render on unrelated store updates
  const center = useMemo(
    () => getSearchCenter({ searchLocation, userLocation }),
    [searchLocation, userLocation]
  );

  useEffect(() => {
    loadLocation();
  }, []);

  const handleBook = useCallback((doctorId: string) => {
    navigation.navigate('DoctorDetail', { id: doctorId });
  }, [navigation]);

  const renderDoctor = useCallback(({ item }: { item: Doctor }) => (
    <DoctorCard
      doctor={item}
      isActive={selectedDoctorId === item.id}
      onPress={setSelectedDoctor}
      onBook={handleBook}
    />
  ), [selectedDoctorId, setSelectedDoctor, handleBook]);


  const renderListStatus = () => {
    if (isLoadingDoctors) {
      return (
        <View style={styles.status}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.statusText}>Finding doctors near you…</Text>
        </View>
      );
    }
    if (doctorsError) {
      return (
        <View style={styles.status}>
          <Text style={styles.statusText}>{doctorsError}</Text>
          <TouchableOpacity onPress={loadDoctors}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.status}>
        <Text style={styles.statusText}>{allDoctors.length > 0 ? 'No doctors match your filters.' : `No doctors found within ${filters.radiusKm} km.`}</Text>
      </View>
    );
  };

  const listProps = {
    data: doctors,
    keyExtractor: (item: Doctor) => item.id,
    contentContainerStyle: styles.listContent,
    ListEmptyComponent: renderListStatus,
    renderItem: renderDoctor,
    extraData: selectedDoctorId,
    initialNumToRender: 6,
    maxToRenderPerBatch: 6,
    windowSize: 5,
    removeClippedSubviews: true,
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
              onCalloutPress={handleBook}
              userLocation={userLocation}
              center={center}
              searchedPlaceLabel={searchLocation?.label}
            />
          </View>
          <FlatList {...listProps} />
        </View>
      );
    }

    // Desktop/Tablet Layout
    return (
      <View style={styles.desktopContainer}>
        <View style={styles.listPanelDesktop}>
          <FlatList {...listProps} />
        </View>
        <View style={styles.mapPanelDesktop}>
          <MapPanel 
            doctors={doctors}
            selectedDoctorId={selectedDoctorId}
            onMarkerPress={setSelectedDoctor}
            onCalloutPress={handleBook}
            userLocation={userLocation}
            center={center}
            searchedPlaceLabel={searchLocation?.label}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Navbar
        city={searchLocation ? searchLocation.label : userLocation.city}
        isLoading={userLocation.isLoading}
        isSearchedPlace={!!searchLocation}
        onPressLocation={() => navigation.navigate('LocationSearch')}
      />
      <FilterBar
        onOpenFilters={() => navigation.navigate('FilterSheet')}
        resultCount={doctors.length}
        specialty={filters.specialty}
        radiusKm={filters.radiusKm}
        openNow={filters.openNow}
        showOpenNow={allDoctors.some(d => d.isOpenNow != null)}
        onToggleOpenNow={() => updateFilters({ openNow: !filters.openNow })}
      />
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
  status: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  statusText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  retryText: {
    color: theme.colors.primary,
    fontWeight: '600',
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
