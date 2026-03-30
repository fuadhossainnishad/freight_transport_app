import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { EarningsStackParamList } from "./types";
import EarningsScreen from "../presentation/earnings/screens/Earnings.screen";
import WithdrawScreen from "../presentation/earnings/screens/Withdraw.screen";

const Stack = createNativeStackNavigator<EarningsStackParamList>();

export default function EarningsStack() {
  return (
    <Stack.Navigator
      initialRouteName='Earning'
      screenOptions={{
        headerShown: false
      }}>

      <Stack.Screen
        name='Earning'
        component={EarningsScreen}
      />
      <Stack.Screen
        name='Withdraw'
        component={WithdrawScreen}
      />
    </Stack.Navigator>
  );
}