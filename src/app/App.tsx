import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from '../navigation/RootNavigation';
import { AuthProvider } from './context/Auth.context';
import { UserProvider } from './context/User.context';
export default function RootApp() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <UserProvider>
          <RootNavigation />
        </UserProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
