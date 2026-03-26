import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DriverStackParamList } from "./types";
import DriverProfilesScreen from "../presentation/driver/screens/DriverProfilesScreen";
import DriverProfileDetailsScreen from '../presentation/driver/screens/DriverProfileDetailsScreen';
import AddDriverScreen from "../presentation/driver/screens/AddDriverScreen";
import UpdateDriverScreen from "../presentation/driver/screens/UpdateDriverScreen";

const Stack = createNativeStackNavigator<DriverStackParamList>();
export default function DriverStackStack() {
  return (
    <Stack.Navigator
      initialRouteName='DriverProfile'
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen
        name='DriverProfile'
        component={DriverProfilesScreen}
      />
      <Stack.Screen
        name='DriverProfileDetails'
        component={DriverProfileDetailsScreen}
      />

      <Stack.Screen
        name='AddDriver'
        component={AddDriverScreen}
      />
      <Stack.Screen
        name='UpdateDriverProfile'
        component={UpdateDriverScreen}
      />
    </Stack.Navigator>
  );
}