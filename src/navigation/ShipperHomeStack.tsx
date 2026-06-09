import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ShipperHomeStackParamList, } from "./types";
import ShipperHome from "../presentation/shipper/screens/ShipperHome.screen";
import CreateShipmentScreen from "../presentation/shipper/screens/CreateShipmentScreen";
import AddressPickerScreen from "../presentation/shipper/screens/AddressPicker.Screen";

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
      <Stack.Screen
        name='AddressPicker'
        component={AddressPickerScreen}
      />

    </Stack.Navigator>
  );
}