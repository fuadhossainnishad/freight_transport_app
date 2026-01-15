import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../app/context/User.context';
import { FormProvider } from 'react-hook-form';
import { ShipperAuthParamList } from '../presentation/auth/types';
import Screen from '../shared/components/Screen';

const Stack = createNativeStackNavigator<ShipperAuthParamList>();
export default function ShipperAuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="" />
    </Stack.Navigator>
  );
}
