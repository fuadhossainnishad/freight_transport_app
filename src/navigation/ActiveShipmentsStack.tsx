import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ActiveShipmentsStackParamList } from "./types";
import ActiveShipmentsScreen from "../presentation/shipment/screens/ActiveShipments.screen";
import CreateShipmentScreen from "../presentation/transporter/screens/CreateShipmentScreen";
import ShipmentDetailsScreen from "../presentation/shipment/screens/ShipmentDetails.screen";
import ShipmentTrackingScreen from "../presentation/shipment/screens/ShipmentTrackingScreen";

const Stack = createNativeStackNavigator<ActiveShipmentsStackParamList>();

export default function ActiveShipmentsStack() {
  return (
    <Stack.Navigator
      initialRouteName='ActiveShipments'
      screenOptions={{
        headerShown: false
      }}>

      <Stack.Screen
        name='ActiveShipments'
        component={ActiveShipmentsScreen}
      />
      <Stack.Screen
        name='CreateShipment'
        component={CreateShipmentScreen}
      />
      <Stack.Screen
        name='ShipmentDetails'
        component={ShipmentDetailsScreen}
      />
      <Stack.Screen
        name='ShipmentTracking'
        component={ShipmentTrackingScreen}
      />
    </Stack.Navigator>
  );
}