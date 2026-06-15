import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ShipperHomeStackParamList, } from "./types";
import ShipperHome from "../presentation/shipper/screens/ShipperHome.screen";
import CreateShipmentScreen from "../presentation/shipper/screens/CreateShipmentScreen";
import AddressPickerScreen from "../presentation/shipper/screens/AddressPicker.Screen";
import ShipperBids from "../presentation/shipper/screens/ShipperBids.screen";
import BidDetails from "../presentation/shipper/screens/BidDetails.screen";

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
        name='Bids'
        component={ShipperBids}
      />
      <Stack.Screen
        name='BidDetails'
        component={BidDetails}
      />

    </Stack.Navigator>
  );
}