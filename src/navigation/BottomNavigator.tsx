import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

// import Account from '../screens/home/Account.screen';

/* ----------------------------------------------
   IMPORT YOUR SVG ICONS
---------------------------------------------- */
import HomeIcon from '../assets/icons/home.svg';
import HomeIconOutline from '../assets/icons/homeOutline.svg';
import NotificationIcon from '../assets/icons/notification.svg';
import NotificationIconOutline from '../assets/icons/notificationOutline.svg';
import Profile from '../assets/icons/profile.svg';
import NotificationNavigator from './NotificationNavigator';
import HomeNavigator from './HomeNavigator';
import SettingsManagementNavigator from './SettingsNavigator';

/* ----------------------------------------------
   TYPE DEFINITIONS
---------------------------------------------- */
export type RootTabParamList = {
  Home: undefined;
  Notifications: undefined;
  Account: undefined;
};

type TabIconProps = {
  routeName: keyof RootTabParamList;
  focused: boolean;
};

/* ----------------------------------------------
   TAB ICON COMPONENT
---------------------------------------------- */
function TabIcon({ routeName, focused }: TabIconProps) {
  let IconComponent: React.FC<any> | null = null;
  let label = '';

  switch (routeName) {
    case 'Home':
      IconComponent = focused ? HomeIcon : HomeIconOutline;
      label = 'Dashboard';
      break;
    case 'Notifications':
      IconComponent = focused ? NotificationIcon : NotificationIconOutline;
      label = 'Notifications';
      break;
    case 'Account':
      IconComponent = focused ? Profile : Profile;
      label = 'Account';
      break;
  }

  return (
    <View
      className={`flex-row items-center justify-center rounded-full px-4 py-2 ${
        focused ? 'bg-[#F8EFE4] w-32 leading-5' : ''
      }`}
    >
      {IconComponent && <IconComponent width={26} height={26} />}
      {focused && (
        <Text className="text-black text-sm font-medium">{label}</Text>
      )}
    </View>
  );
}

/* ----------------------------------------------
   STABLE FUNCTION TO AVOID NESTED COMPONENTS
---------------------------------------------- */
function renderTabIcon(
  route: RouteProp<RootTabParamList, keyof RootTabParamList>,
) {
  return function IconRenderer({ focused }: { focused: boolean }) {
    return <TabIcon routeName={route.name} focused={focused} />;
  };
}

/* ----------------------------------------------
   BOTTOM TAB NAVIGATOR
---------------------------------------------- */
const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: renderTabIcon(route),
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Notifications" component={NotificationNavigator} />
      <Tab.Screen name="Account" component={SettingsManagementNavigator} />
    </Tab.Navigator>
  );
}

/* ----------------------------------------------
   STYLE SHEET (optional for static styles)
---------------------------------------------- */
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    height: 80,
  },
});
