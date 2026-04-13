import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { DiscoveryScreen } from '../../features/discovery/presentation/screens/DiscoveryScreen';
import { BookingsScreen } from '../../features/bookings/presentation/screens/BookingsScreen';
import { MedicalIdScreen } from '../../features/medicalId/presentation/screens/MedicalIdScreen';
import { ProfileScreen } from '../../features/profile/presentation/screens/ProfileScreen';
import { theme } from '../theme';

export type MainTabParamList = {
  DiscoverTab: undefined;
  BookingsTab: undefined;
  MedicalIdTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textHint,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      }}
    >
      <Tab.Screen 
        name="DiscoverTab" 
        component={DiscoveryScreen} 
        options={{ 
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="explore" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingsScreen}
        options={{ 
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event-available" size={size} color={color} />
          ), 
        }} 
      />
      <Tab.Screen 
        name="MedicalIdTab" 
        component={MedicalIdScreen}
        options={{ 
          title: 'Medical ID',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="medical-information" size={size} color={color} />
          ), 
        }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ), 
        }} 
      />
    </Tab.Navigator>
  );
};
