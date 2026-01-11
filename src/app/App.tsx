import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from '../navigation/RootNavigation';
import { AuthProvider } from './context/Auth.context';
export default function RootApp() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
