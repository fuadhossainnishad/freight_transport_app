import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShipperAuthParamList } from '../presentation/auth/types';
import TransporterUploadDocScreen from '../presentation/auth/screens/TransporterUploadDoc.screen';

const Stack = createNativeStackNavigator<ShipperAuthParamList>();

export default function TransporterTab() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='UploadDocuments' component={TransporterUploadDocScreen} />
    </Stack.Navigator>
  );
}
