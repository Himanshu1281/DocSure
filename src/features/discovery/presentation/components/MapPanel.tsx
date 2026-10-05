import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { Doctor } from '../../domain/entities/Doctor';

interface MapPanelProps {
  doctors: Doctor[];
  selectedDoctorId: string | null;
  onMarkerPress: (id: string) => void;
  onCalloutPress: (id: string) => void;
  userLocation: { latitude: number | null; longitude: number | null };
  // Where results are searched around (GPS or a searched place)
  center: { latitude: number; longitude: number };
  // Label for a searched place; shown as its own pin. Omit when searching around GPS.
  searchedPlaceLabel?: string;
}

// Minimal grayscale map style for "Clinical Curator" theme
const minimalMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#eeeeee' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#dadada' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [{ color: '#e5e5e5' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9c9c9' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
];

const MapPanelComponent: React.FC<MapPanelProps> = ({ doctors, selectedDoctorId, onMarkerPress, onCalloutPress, userLocation, center, searchedPlaceLabel }) => {
  const mapRef = useRef<MapView>(null);

  const defaultRegion = {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // initialRegion only applies on first render, so follow the search center as it changes
  useEffect(() => {
    mapRef.current?.animateToRegion({
      latitude: center.latitude,
      longitude: center.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 600);
  }, [center.latitude, center.longitude]);

  // Fit the nearest results (plus the user) into view when results load
  useEffect(() => {
    if (doctors.length === 0) return;
    const points = doctors.slice(0, 15).map(d => ({ latitude: d.latitude, longitude: d.longitude }));
    points.push(center);
    mapRef.current?.fitToCoordinates(points, {
      edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
      animated: true,
    });
  }, [doctors]);

  // Selecting a card pans the map to its marker
  useEffect(() => {
    const selected = doctors.find(d => d.id === selectedDoctorId);
    if (selected) {
      mapRef.current?.animateToRegion({
        latitude: selected.latitude,
        longitude: selected.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  }, [selectedDoctorId]);

  const centerOnUser = () => {
    if (userLocation.latitude && userLocation.longitude) {
      // Use tightly bounded deltas (0.005) to force a street-level "zoom in" 
      // This is the most reliable cross-platform way to zoom in React Native Maps, 
      // as iOS uses 'altitude' and Android uses 'zoom' natively in animateCamera.
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={defaultRegion}
        customMapStyle={minimalMapStyle}
        showsUserLocation={!!(userLocation.latitude && userLocation.longitude)}
        showsMyLocationButton={false} 
      >
        {searchedPlaceLabel && (
          <Marker coordinate={center} title={searchedPlaceLabel} pinColor="#185FA5" />
        )}
        {doctors.map(doctor => (
          <Marker
            key={doctor.id}
            coordinate={{ latitude: doctor.latitude, longitude: doctor.longitude }}
            title={doctor.name}
            description={`${doctor.specialty} · Tap to view profile`}
            onPress={() => onMarkerPress(doctor.id)}
            onCalloutPress={() => onCalloutPress(doctor.id)}
            pinColor={selectedDoctorId === doctor.id ? '#0F6E56' : '#1D9E75'}
            // Default pins never change their view; stop Android re-snapshotting each marker
            tracksViewChanges={false}
          />
        ))}
      </MapView>

      {doctors.some(d => d.source === 'osm') && (
        <View style={styles.attribution} pointerEvents="none">
          <Text style={styles.attributionText}>Clinic data © OpenStreetMap contributors</Text>
        </View>
      )}

      {userLocation.latitude && userLocation.longitude ? (
        <TouchableOpacity style={styles.locateButton} onPress={centerOnUser}>
          <MaterialIcons name="my-location" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  attribution: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attributionText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  locateButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.radius.round,
    elevation: 4, // shadow for android
    shadowColor: '#000', // shadow for ios
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});

export const MapPanel = React.memo(MapPanelComponent);
