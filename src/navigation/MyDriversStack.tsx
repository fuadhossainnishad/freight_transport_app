import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MyDriversStackParamList } from "./types";
import MyDriversScreen from "../presentation/driver/screens/MyDriversScreen";
import DriverProfileDetailsScreen from "../presentation/driver/screens/DriverProfileDetailsScreen";
import AddDriverScreen from "../presentation/driver/screens/AddDriverScreen";
import UpdateDriverScreen from "../presentation/driver/screens/UpdateDriverScreen";

const Stack = createNativeStackNavigator<MyDriversStackParamList>();

export default function MyDriversStack() {
  return (
    <Stack.Navigator
      initialRouteName="MyDrivers"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MyDrivers" component={MyDriversScreen} />
      <Stack.Screen name="DriverProfileDetails" component={DriverProfileDetailsScreen} />
      <Stack.Screen name="AddDriver" component={AddDriverScreen} />
      <Stack.Screen name="UpdateDriverProfile" component={UpdateDriverScreen} />
    </Stack.Navigator>
  );
}
