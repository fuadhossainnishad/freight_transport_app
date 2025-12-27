import { useAuth } from '../app/providers/AuthProvider';

const RootNavigation = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainTabs /> : <AuthStack />;
};
