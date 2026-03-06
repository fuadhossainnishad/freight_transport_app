import { useAuth } from '../app/context/Auth.context';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigation() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppStack /> : <AuthStack />;
}
