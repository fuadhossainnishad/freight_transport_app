import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../domains/auth/screens/login.screen';
import SignupScreen from '../domains/auth/screens/signup.screen';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  VerifyEmail: undefined;
  VerifyOtp: undefined;
  VerifyOtp2: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

const stackNavigatorOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
  gestureDirection: 'horizontal',
};

export default function AuthStack() {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Signup"
        screenOptions={stackNavigatorOptions}
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
