import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Doctor } from '../../domain/entities/Doctor';

interface MapPanelProps {
  doctors: Doctor[];
  selectedDoctorId: string | null;
  onMarkerPress: (id: string) => void;
  userLocation: { latitude: number | null; longitude: number | null };
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

export const MapPanel: React.FC<MapPanelProps> = ({ doctors, selectedDoctorId, onMarkerPress, userLocation }) => {
  const defaultRegion = {
    latitude: userLocation.latitude || 28.4595,
    longitude: userLocation.longitude || 77.0266,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={defaultRegion}
        customMapStyle={minimalMapStyle}
        showsUserLocation={!!(userLocation.latitude && userLocation.longitude)}
        showsMyLocationButton={false}
      >
        {doctors.map(doctor => (
          <Marker
            key={doctor.id}
            coordinate={{ latitude: doctor.latitude, longitude: doctor.longitude }}
            onPress={() => onMarkerPress(doctor.id)}
            pinColor={selectedDoctorId === doctor.id ? '#0F6E56' : '#1D9E75'}
          />
        ))}
      </MapView>
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
});
