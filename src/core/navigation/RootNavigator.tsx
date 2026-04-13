import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { FilterSheet } from '../../features/filters/presentation/screens/FilterSheet';
import { DoctorDetailScreen } from '../../features/doctorDetail/presentation/screens/DoctorDetailScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  FilterSheet: undefined;
  DoctorDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'transparentModal', animation: 'none' }}>
          <Stack.Screen name="FilterSheet" component={FilterSheet} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
