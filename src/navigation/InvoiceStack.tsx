import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { InvoiceStackParamList } from "./types";
import ShipmentTrackingScreen from "../presentation/shipment/screens/ShipmentTrackingScreen";
import InvoicesScreen from "../presentation/invoice/screens/Invoices.screen";
import InvoiceDetailsScreen from "../presentation/invoice/screens/InvoiceDetails.screen";

const Stack = createNativeStackNavigator<InvoiceStackParamList>();

export default function InvoiceStack() {
  return (
    <Stack.Navigator
      initialRouteName='Invoices'
      screenOptions={{
        headerShown: false
      }}>

      <Stack.Screen
        name='Invoices'
        component={InvoicesScreen}
      />
      
      <Stack.Screen
        name='InvoiceDetails'
        component={InvoiceDetailsScreen}
      />
      <Stack.Screen
        name='ShipmentTracking'
        component={ShipmentTrackingScreen}
      />
    </Stack.Navigator>
  );
}