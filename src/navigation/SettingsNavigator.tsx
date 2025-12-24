import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/settings/settings';
import MailSettings from '../screens/settings/mailSetting.screen';
import AddNewMailScreen from '../screens/settings/addNewMail.screen';
import InfoScreen from '../screens/settings/info/info.screen';
import CompanyProfileScreen from '../screens/settings/profile/companyProfile.screen';
import EditProfileScreen from '../screens/settings/profile/editProfile.screen';
import UserProfileScreen from '../screens/settings/profile/userProfile.screen';
import EditUserProfileScreen from '../screens/settings/profile/editUserProfile.screen';
import ColorPickerScreen from '../screens/colorPicker.screen';
import UsersManagementNavigator from './UsersNavigator';
import RolePermissionScreen from '../screens/settings/rolePermission.screen copy';
import AddNewRoleScreen from '../screens/settings/addNewRole.screen';
import SubscriptionScreen from '../screens/settings/subscription/subscription.screen';

export type SettingsStackParamList = {
  Settings: undefined;
  MailSettings: undefined;
  AddNewMail: undefined;
  InfoScreen: {
    title: string;
    content?: string;
    slug?: string;
  };
  Profile: undefined;
  EditProfile: undefined;
  UserProfile: undefined;
  EditUserProfile: undefined;
  Appcolor: undefined;
  Users: undefined;
  RolePermission: undefined;
  AddNewRole: undefined;
  Subscription: undefined;

  // Logout: undefined;
  // CreateSettings: undefined;
  // SettingsDetails: {
  //   Settings: {
  //     id: string;
  //     date: string;
  //     SettingsName: string;
  //     custName: string;
  //     phone: string;
  //     email: string;
  //     address: string;
  //     creator: string;
  //     status: string;
  //   };
  // };
};

export default function SettingsManagementNavigator() {
  const Stack = createNativeStackNavigator<SettingsStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MailSettings"
        component={MailSettings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddNewMail"
        component={AddNewMailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InfoScreen"
        component={InfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={CompanyProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditUserProfile"
        component={EditUserProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Appcolor"
        component={ColorPickerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Users"
        component={UsersManagementNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RolePermission"
        component={RolePermissionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddNewRole"
        component={AddNewRoleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Logout"
        component={LoginScreen}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}
