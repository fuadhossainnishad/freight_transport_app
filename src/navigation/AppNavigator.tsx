import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from '../screens/onboarding.screen';
import OnboardingScreen2 from '../screens/onboarding2.screen';
import OnboardingScreen3 from '../screens/onboarding3.screen copy';
import LoginScreen from '../screens/auth/login.screen';
import VerifyEmailScreen from '../screens/auth/verifyEmail.screen';
import VerifyOtpScreen from '../screens/auth/verifyOtp.screen';
import SignupScreen from '../screens/auth/signup.screen';
import ColorPickerScreen from '../screens/colorPicker.screen';
import ForgotPasswordScreen from '../screens/auth/forgotPassword.screen';
import ResetPasswordScreen from '../screens/auth/resetPassword.screen';
import VerifyOtpScreen2 from '../screens/auth/verifyOtp2.screen';
import BottomTabs from './BottomNavigator';

export type RootStackParamList = {
  Onboarding: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Login: undefined;
  VerifyEmail: undefined;
  VerifyOtp: undefined;
  VerifyOtp2: undefined;
  Signup: { selectedColor?: string } | undefined;
  ColorPicker: undefined;
  ForgotPassword: undefined
  ResetPassword: undefined
  HomeTab: undefined
};

export default function AppNavigator() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding2"
          component={OnboardingScreen2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding3"
          component={OnboardingScreen3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyOtp"
          component={VerifyOtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyOtp2"
          component={VerifyOtpScreen2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ColorPicker"
          component={ColorPickerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTab"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
