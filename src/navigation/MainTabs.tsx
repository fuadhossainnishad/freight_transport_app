import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useUser } from '../app/providers/UserProvider';
import { useAuth } from '../app/providers/AuthProvider';

const Tabs = createBottomTabNavigator();

export default function MainTabs() {
  const user = useUser();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    user.role === 'transporter? Transporter
  }
}
