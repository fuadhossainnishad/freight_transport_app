import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../app/context/User.context';
import { FormProvider } from 'react-hook-form';
import { TransporterAuthParamList } from '../presentation/auth/types';

const Stack = createNativeStackNavigator<TransporterAuthParamList>();
export default function TransporterAuthStack() {
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UploadDocuments" component={} />
  </Stack.Navigator>;
}
