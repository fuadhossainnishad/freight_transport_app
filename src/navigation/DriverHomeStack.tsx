import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DriverHomeStackParamList } from "./types";
import DriverProfilesScreen from "../presentation/driver/screens/DriverProfilesScreen";
import DriverProfileDetailsScreen from '../presentation/driver/screens/DriverProfileDetailsScreen';
import AddDriverScreen from "../presentation/driver/screens/AddDriverScreen";
import UpdateDriverScreen from "../presentation/driver/screens/UpdateDriverScreen";
import DriverHomeScreen from "../presentation/driver/screens/DriverHome.screen";

const Stack = createNativeStackNavigator<DriverHomeStackParamList>();
export default function DriverStackStack() {
  return (
    <Stack.Navigator
      initialRouteName='DriverHome'
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen
        name='DriverHome'
        component={DriverHomeScreen}
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