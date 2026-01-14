import { useUser } from '../app/context/User.context';
import { FormProvider } from 'react-hook-form';
import ShipperAuthStack from './ShipperAuthStack';
import TransporterAuthStack from './TransporterAuthStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthParamList = {
  RootAuth: undefined,
  ShipperAuth: undefined,
  TransporterAuth: undefined,
};

const Stack = createNativeStackNavigator<AuthParamList>();

export default function AuthStack() {
  const { user } = useUser();
  return (
    <FormProvider>
      {user?.role === 'shipper' ? (
        <ShipperAuthStack />
      ) : (
        <TransporterAuthStack />
      )}
    </FormProvider>
  );
}
