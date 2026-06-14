import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActiveShipmentsStackParamList } from './types';
import MyShipmentsScreen from '../presentation/shipment/screens/MyShipments.screen';
import CreateShipmentScreen from '../presentation/shipper/screens/CreateShipmentScreen';
import ShipmentDetailsScreen from '../presentation/shipment/screens/ShipmentDetails.screen';
import ShipmentTrackingScreen from '../presentation/shipment/screens/ShipmentTrackingScreen';
import ActiveShipmentDetailsScreen from '../presentation/availablebids/screens/ActiveShipmentDetailsScreen';
import ShipmentDetailScreen from '../presentation/shipper/screens/ShipmentDetail.screen';

const Stack = createNativeStackNavigator<ActiveShipmentsStackParamList>();

export default function ShipperShipmentsStack() {
  return (
    <Stack.Navigator
      initialRouteName="ActiveShipments"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ActiveShipments" component={MyShipmentsScreen} />

      <Stack.Screen
        name="ShipperShipmentDetail"
        component={ShipmentDetailScreen}
      />

      <Stack.Screen
        name="ActiveShipmentDetailsScreen"
        component={ActiveShipmentDetailsScreen}
      />

      <Stack.Screen name="CreateShipment" component={CreateShipmentScreen} />

      <Stack.Screen name="ShipmentDetails" component={ShipmentDetailsScreen} />

      <Stack.Screen
        name="ShipmentTracking"
        component={ShipmentTrackingScreen}
      />
    </Stack.Navigator>
  );
}
