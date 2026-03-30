import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TransporterHomeStackParamList, } from "./types";
import TransporterHomeScreen from "../presentation/transporter/screens/TransporterHome.screen";
import ShipmentDetailsScreen from "../presentation/availablebids/screens/ShipmentDetails.screen";
import ActiveShipmentsScreen from "../presentation/shipment/screens/ActiveShipments.screen";
import ShipmentTrackingScreen from "../presentation/shipment/screens/ShipmentTrackingScreen";

const Stack = createNativeStackNavigator<TransporterHomeStackParamList>();

export default function TransporterHomeStack() {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false
      }}>

      <Stack.Screen
        name='Home'
        component={TransporterHomeScreen}
      />
      <Stack.Screen
        name='ShipmentDetails'
        component={ShipmentDetailsScreen}
      />
      <Stack.Screen
        name='ActiveShipments'
        component={ActiveShipmentsScreen}
      />
      <Stack.Screen
        name='ShipmentTracking'
        component={ShipmentTrackingScreen}
      />
    </Stack.Navigator>
  );
}