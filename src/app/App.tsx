import { StatusBar } from 'react-native';
import RootNavigation from '../navigation/RootNavigation';
import { AuthProvider } from './context/Auth.context';
import { UserProvider } from './context/User.context';

export default function RootApp() {
  return (
    <AuthProvider>
      <UserProvider>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <RootNavigation />
      </UserProvider>
    </AuthProvider>
  );
}
