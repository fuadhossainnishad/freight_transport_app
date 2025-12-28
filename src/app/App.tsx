import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import OnboardingScreen from './screens/onboarding.screen';
import AppNavigator from './navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider } from './providers/UserProvider';

export default function App() {

  return (
    <SafeAreaProvider className="">
      <NavigationContainer>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              <GestureHandlerRootView style={styles.gestureHnadlerStyles}>
                <SafeAreaView className="flex-1">
                  <AppNavigator />
                  <Toast />
                </SafeAreaView>
              </GestureHandlerRootView>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gestureHnadlerStyles: {
    flex: 1,
  },
});
