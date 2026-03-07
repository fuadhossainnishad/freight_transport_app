import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ShipperHomeStackParamList, } from "./types";
import ShipperHome from "../presentation/shipper/screens/ShipperHome.screen";
import CreateShipmentScreen from "../presentation/shipper/screens/CreateShipmentScreen";

const Stack = createNativeStackNavigator<ShipperHomeStackParamList>();

export default function ShipperHomeStack() {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false
      }}>

      <Stack.Screen
        name='Home'
        component={ShipperHome}
      />
      <Stack.Screen
        name='CreateShipment'
        component={CreateShipmentScreen}
      />

    </Stack.Navigator>
  );
}