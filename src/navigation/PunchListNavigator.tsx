import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PunchListScreen from '../screens/punchlist/punchList.screen';
import PunchlistDetailsScreen from '../screens/punchlist/punchlistDetails.screen';
import CreatePunchlistScreen from '../screens/punchlist/createPunchlist.screen';

export type PunchStackParamList = {
  PunchList: undefined;
  CreatePunchlist: undefined;
  PunchlistDetails: any
};

export default function PunchListNavigator() {
  const Stack = createNativeStackNavigator<PunchStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PunchList"
        component={PunchListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreatePunchlist"
        component={CreatePunchlistScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PunchlistDetails"
        component={PunchlistDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
