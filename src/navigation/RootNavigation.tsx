import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../app/context/Auth.context';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}
