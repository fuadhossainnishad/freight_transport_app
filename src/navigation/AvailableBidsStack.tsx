import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AvailableBidsStackParamList } from "./types";
import AvailableBidsScreen from "../presentation/availablebids/screens/AvailableBidsScreen";
import ShipmentDetailsScreen from '../presentation/availablebids/screens/ShipmentDetails.screen';
import AssignVehicleDriverScreen from "../presentation/availablebids/screens/AssignVehicleDriverScreen";

const Stack = createNativeStackNavigator<AvailableBidsStackParamList>();

export default function AvailableBidsStack() {
  return (
    <Stack.Navigator
      initialRouteName='AvailableBids'
      screenOptions={{
        headerShown: false
      }}>

      <Stack.Screen
        name='AvailableBids'
        component={AvailableBidsScreen}
      />
      <Stack.Screen
        name='ShipmentDetails'
        component={ShipmentDetailsScreen}
      />
      <Stack.Screen
        name='AssignVehicleDriver'
        component={AssignVehicleDriverScreen}
      />
    </Stack.Navigator>
  );
}