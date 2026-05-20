import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DriverStackParamList } from "./types";
import DriverProfilesScreen from "../presentation/driver/screens/DriverProfilesScreen";
import DriverProfileDetailsScreen from '../presentation/driver/screens/DriverProfileDetailsScreen';
import AddDriverScreen from "../presentation/driver/screens/AddDriverScreen";
import UpdateDriverScreen from "../presentation/driver/screens/UpdateDriverScreen";
import ShipmentDetailScreen from "../presentation/driver/screens/ShipmentDetailScreen";
import DriverHomeScreen from "../presentation/driver/screens/DriverHome.screen";
import LiveTrackingScreen from "../presentation/driver/screens/LiveTrackingScreen";

const Stack = createNativeStackNavigator<DriverStackParamList>();
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
        name="ShipmentDetail" 
        component={ShipmentDetailScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="LiveTracking" 
        component={LiveTrackingScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name='AddDriver'
        component={AddDriverScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='UpdateDriverProfile'
        component={UpdateDriverScreen}
      />
      <Stack.Screen
        name='DriverProfile'
        component={DriverProfilesScreen}
      />
      <Stack.Screen
        name='DriverProfileDetails'
        component={DriverProfileDetailsScreen}
      />
    </Stack.Navigator>
  );
}