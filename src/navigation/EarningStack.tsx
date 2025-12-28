import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Text } from 'react-native';

export type EarningStackParamList = {
  TranportsHome: undefined;
  ActiveShipments: undefined;
  ActiveShipmentsDetails: undefined;
};

export default function EarningStack() {
  const Stack = createNativeStackNavigator<EarningStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TranportsHome"
        component={<Text>Home</Text>}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ActiveShipments"
        component={<Text>Home</Text>}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ActiveShipmentsDetails"
        component={<Text>Home</Text>}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
