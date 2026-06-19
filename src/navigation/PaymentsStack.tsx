import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PaymentsStackParamList } from "./types";
import PaymentRequestsScreen from "../presentation/payment/screens/PaymentRequests.screen";
import PayWebViewScreen from "../presentation/payment/screens/PayWebView.screen";

const Stack = createNativeStackNavigator<PaymentsStackParamList>();

export default function PaymentsStack() {
  return (
    <Stack.Navigator
      initialRouteName="PaymentRequests"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="PaymentRequests" component={PaymentRequestsScreen} />
      <Stack.Screen name="PayWebView" component={PayWebViewScreen} />
    </Stack.Navigator>
  );
}
