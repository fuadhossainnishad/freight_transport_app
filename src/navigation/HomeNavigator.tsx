import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/home/Home.screen';
import SwitchCompanyScreen from '../screens/home/SwitchCompany.screen';
import JobManagementNavigator from './JobNavigator';
import ReportManagementNavigator from './ReportNavigator';
import PunchListNavigator from './PunchListNavigator';

export type HomeStackParamList = {
  Dashboard: undefined;
  SwitchCompany: undefined;
  Job: undefined;
  Reports: undefined;
  // Receipts: undefined
  Punchlist: undefined;
};

export default function HomeNavigator() {
  const Stack = createNativeStackNavigator<HomeStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SwitchCompany"
        component={SwitchCompanyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Job"
        component={JobManagementNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportManagementNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Punchlist"
        component={PunchListNavigator}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
                name="Receipts"
                component={SwitchCompanyScreen}
                options={{ headerShown: false }}
            /> */}
    </Stack.Navigator>
  );
}
