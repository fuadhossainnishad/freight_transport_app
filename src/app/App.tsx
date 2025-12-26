import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import OnboardingScreen from './screens/onboarding.screen';
import AppNavigator from './navigation/AppNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider className="">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView className="bg-white flex-1">
        <AppNavigator />
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// function AppContent() {
//   return (
//     <View className="">
//       <OnboardingScreen />
//     </View>
//   );
// }
