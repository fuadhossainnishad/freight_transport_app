import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TransporterHomeStackParamList, } from "./types";
import ShipmentDetailsScreen from "../presentation/availablebids/screens/ShipmentDetails.screen";
import ActiveShipmentsScreen from "../presentation/shipment/screens/ActiveShipments.screen";
import ActiveShipmentDetailsScreen from "../presentation/availablebids/screens/ActiveShipmentDetailsScreen";
import ShipmentTrackingScreen from "../presentation/shipment/screens/ShipmentTrackingScreen";
import TransporterHomeScreen2 from "../presentation/transporter/screens/TransporterHome.screen2";
import AssignVehicleDriverScreen from "../presentation/availablebids/screens/AssignVehicleDriverScreen";
import PayWebViewScreen from "../presentation/payment/screens/PayWebView.screen";

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
        component={TransporterHomeScreen2}
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
      <Stack.Screen
        name='ActiveShipmentDetailsScreen'
        component={ActiveShipmentDetailsScreen}
      />
      <Stack.Screen
        name='AssignVehicleDriver'
        component={AssignVehicleDriverScreen}
      />
      {/* PayDunya checkout for a transporter payment request. */}
      <Stack.Screen
        name='PayWebView'
        component={PayWebViewScreen}
      />
    </Stack.Navigator>
  );
}