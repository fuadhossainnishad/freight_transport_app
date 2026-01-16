import { useUser } from '../app/context/User.context';
import ShipperAuthStack from './ShipperAuthStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthParamList } from '../presentation/auth/types';
import AuthFormContext from '../presentation/auth/AuthForm.context';
import TransporterAuthStack from './TransporterAuthStack';
import SignupScreen from '../presentation/auth/screens/Signup.screen';

const Stack = createNativeStackNavigator<AuthParamList>();

export default function AuthStack() {
  const { user } = useUser();
  return (
    <AuthFormContext>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='RootAuth'
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        {user?.role === 'shipper' ? (
          <Stack.Screen
            name="ShipperAuth"
            component={ShipperAuthStack}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="TransporterAuth"
            component={TransporterAuthStack}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </AuthFormContext>
  );
}
