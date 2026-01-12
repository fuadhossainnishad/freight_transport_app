import RootNavigation from '../navigation/RootNavigation';
import { AuthProvider } from './context/Auth.context';
import { UserProvider } from './context/User.context';
export default function RootApp() {
  return (
    <AuthProvider>
      <UserProvider>
        <RootNavigation />
      </UserProvider>
    </AuthProvider>
  );
}
