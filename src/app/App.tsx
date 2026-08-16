import { ActivityIndicator, StatusBar, View } from 'react-native';
import RootNavigation from '../navigation/RootNavigation';
import { AuthProvider } from './context/Auth.context';
import { UserProvider } from './context/User.context';
import { useI18nReady } from '../shared/i18n/useLanguage';

export default function RootApp() {
  const i18nReady = useI18nReady();

  if (!i18nReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
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
