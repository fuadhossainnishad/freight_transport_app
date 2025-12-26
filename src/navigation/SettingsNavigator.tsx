import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../domains/settings/settings';
import MailSettings from '../domains/settings/mailSetting.screen';
import AddNewMailScreen from '../domains/settings/addNewMail.screen';
import InfoScreen from '../domains/settings/info/info.screen';
import CompanyProfileScreen from '../domains/settings/profile/companyProfile.screen';
import EditProfileScreen from '../domains/settings/profile/editProfile.screen';
import UserProfileScreen from '../domains/settings/profile/userProfile.screen';
import EditUserProfileScreen from '../domains/settings/profile/editUserProfile.screen';
import ColorPickerScreen from '../domains/colorPicker.screen';
import UsersManagementNavigator from './UsersNavigator';
import RolePermissionScreen from '../domains/settings/rolePermission.screen copy';
import AddNewRoleScreen from '../domains/settings/addNewRole.screen';
import SubscriptionScreen from '../domains/settings/subscription/subscription.screen';

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
