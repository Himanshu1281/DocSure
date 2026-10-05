import React from 'react';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator, MainTabParamList } from './MainTabNavigator';
import { withErrorBoundary } from '../utils/withErrorBoundary';
import { FilterSheet } from '../../features/filters/presentation/screens/FilterSheet';
import { BookAppointmentScreen } from '../../features/bookings/presentation/screens/BookAppointmentScreen';
import { EditMedicalIdScreen } from '../../features/medicalId/presentation/screens/EditMedicalIdScreen';
import { EditProfileScreen } from '../../features/profile/presentation/screens/EditProfileScreen';
import { BookedDoctor } from '../../features/bookings/domain/entities/Booking';
import { SignInScreen } from '../../features/account/presentation/screens/SignInScreen';
import { LocationSearchScreen } from '../../features/discovery/presentation/screens/LocationSearchScreen';
import { DoctorDetailScreen } from '../../features/doctorDetail/presentation/screens/DoctorDetailScreen';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  FilterSheet: undefined;
  DoctorDetail: { id: string };
  BookAppointment: { doctorId: string; bookingId?: string; doctor?: BookedDoctor };
  EditMedicalId: undefined;
  EditProfile: undefined;
  LocationSearch: undefined;
  SignIn: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Same crash isolation as the tabs, so one broken screen can't take the app down
const SafeDoctorDetail = withErrorBoundary(DoctorDetailScreen, 'Curator Profile');
const SafeBookAppointment = withErrorBoundary(BookAppointmentScreen, 'Booking');
const SafeEditMedicalId = withErrorBoundary(EditMedicalIdScreen, 'Medical ID');
const SafeEditProfile = withErrorBoundary(EditProfileScreen, 'Profile');
const SafeLocationSearch = withErrorBoundary(LocationSearchScreen, 'Location Search');
const SafeSignIn = withErrorBoundary(SignInScreen, 'Sign In');
const SafeFilterSheet = withErrorBoundary(FilterSheet, 'Filters');

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="DoctorDetail" component={SafeDoctorDetail} />
          <Stack.Screen name="BookAppointment" component={SafeBookAppointment} />
          <Stack.Screen name="EditMedicalId" component={SafeEditMedicalId} />
          <Stack.Screen name="EditProfile" component={SafeEditProfile} />
          <Stack.Screen name="LocationSearch" component={SafeLocationSearch} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="SignIn" component={SafeSignIn} options={{ animation: 'slide_from_bottom' }} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'transparentModal', animation: 'none' }}>
          <Stack.Screen name="FilterSheet" component={SafeFilterSheet} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
