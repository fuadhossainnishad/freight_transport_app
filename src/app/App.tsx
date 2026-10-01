import { useEffect } from 'react';
import { Alert } from 'react-native';
// @ts-ignore
import messaging from '@react-native-firebase/messaging';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import RootNavigation from '../navigation/RootNavigation';
import { AuthProvider } from './context/Auth.context';
import { UserProvider } from './context/User.context';
import { useI18nReady } from '../shared/i18n/useLanguage';

export default function RootApp() {
  const i18nReady = useI18nReady();

  useEffect(() => {
    let unsubscribe: any;
    try {
      unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      // Show an in-app alert or custom toast when app is in foreground
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || 'You have a new message'
      );
    });
    } catch (e) {
      console.warn("Firebase native module missing", e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);


  if (!i18nReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }} className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#036BB4" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <UserProvider>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <RootNavigation />
      </UserProvider>
    </AuthProvider>
  );
}
