import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TransporterHomeStackParamList, } from "./types";
import TransporterHomeScreen from "../presentation/transporter/screens/TransporterHome.screen";

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
      {/* <Stack.Screen
        name='CreateShipment'
        component={CreateShipmentScreen}
      /> */}

    </Stack.Navigator>
  );
}