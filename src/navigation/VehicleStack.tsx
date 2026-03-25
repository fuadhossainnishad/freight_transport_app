import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { VehicleStackParamList } from "./types";
import VehicleDetailsScreen from "../presentation/Vehicle/screens/VehicleDetails.screen";
import VehiclesScreen from "../presentation/Vehicle/screens/Vehicles.screen";
import AddVehicleScreen from "../presentation/Vehicle/screens/AddVehicle.screen";
import UpdateVehicleScreen from "../presentation/Vehicle/screens/UpdateVehicle.screen";

const Stack = createNativeStackNavigator<VehicleStackParamList>();
export default function VehicleStack() {
  return (
    <Stack.Navigator
      initialRouteName='Vehicle'
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen
        name='Vehicle'
        component={VehiclesScreen}
      />
      <Stack.Screen
        name='VehicleDetails'
        component={VehicleDetailsScreen}
      />

      <Stack.Screen
        name='AddVehicle'
        component={AddVehicleScreen}
      />
      <Stack.Screen
        name='UpdateVehicle'
        component={UpdateVehicleScreen}
      />
    </Stack.Navigator>
  );
}