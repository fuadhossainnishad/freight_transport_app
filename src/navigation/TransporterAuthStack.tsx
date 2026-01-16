import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransporterAuthParamList } from '../presentation/auth/types';
import TransporterUploadDocScreen from '../presentation/auth/screens/TransporterUploadDoc.screen';

const Stack = createNativeStackNavigator<TransporterAuthParamList>();
export default function TransporterAuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='UploadDocuments' component={TransporterUploadDocScreen} />
    </Stack.Navigator>
  )
}
