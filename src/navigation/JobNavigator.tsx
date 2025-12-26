import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobListScreen from '../domains/job/jobList.screen';
import CreateJobScreen from '../domains/job/createJob.screen';
import JobDetailsScreen from '../domains/job/jobDetails.screen';

export type JobStackParamList = {
  JobList: undefined;
  CreateJob: undefined;
  JobDetails: {
    job: {
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

export default function JobManagementNavigator() {
  const Stack = createNativeStackNavigator<JobStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="JobList"
        component={JobListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateJob"
        component={CreateJobScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
