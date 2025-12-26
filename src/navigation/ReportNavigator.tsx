import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateJobScreen from '../domains/job/createJob.screen';
import JobDetailsScreen from '../domains/job/jobDetails.screen';
import ReportListScreen from '../domains/reports/reportList.screen';

export type ReportStackParamList = {
  ReportList: undefined;
  Createreport: undefined;
  ReportDetails: {
    report: {
      id: string;
      date: string;
      jobName: string;
      custName: string;
      phone: string;
      email: string;
      address: string;
      creator: string;
      status: string;
    };
  };
};

export default function ReportManagementNavigator() {
  const Stack = createNativeStackNavigator<ReportStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ReportList"
        component={ReportListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Createreport"
        component={CreateJobScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportDetails"
        component={JobDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
