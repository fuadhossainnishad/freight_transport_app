import { useAuth } from '../app/context/Auth.context';
import MainTab from './MainTab';
import AuthStack from './AuthStack';

export default function RootNavigation() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainTab /> : <AuthStack />;
}
