import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';


import HomeIcon from '../../assets/icons/shipper.svg';
import HomeIconOutline from '../../assets/icons/shipper.svg';
import NotificationIcon from '../../assets/icons/shipper.svg';
import NotificationIconOutline from '../../assets/icons/shipper.svg';
import Profile from '../../assets/icons/shipper.svg';
import { TransporterTabParamList } from './types';

/* ----------------------------------------------
   TYPE DEFINITIONS
---------------------------------------------- */

type TabIconProps = {
  routeName: keyof TransporterTabParamList;
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
    case 'Home':
      IconComponent = focused ? NotificationIcon : NotificationIconOutline;
      label = 'Notifications';
      break;
    case 'Home':
      IconComponent = focused ? Profile : Profile;
      label = 'Account';
      break;
  }

  return (
    <View
      className={`flex-row items-center justify-center rounded-full px-4 py-2 ${focused ? 'bg-[#F8EFE4] w-32 leading-5' : ''
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
  route: RouteProp<TransporterTabParamList, keyof TransporterTabParamList>,
) {
  return function IconRenderer({ focused }: { focused: boolean }) {
    return <TabIcon routeName={route.name} focused={focused} />;
  };
}

/* ----------------------------------------------
   BOTTOM TAB NAVIGATOR
---------------------------------------------- */
const Tab = createBottomTabNavigator<TransporterTabParamList>();

export default function TransporterTabs() {
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
      <Tab.Screen name="Home" component={() => <Text>Home</Text>} />
      {/* <Tab.Screen name="Home" component={() => <Text>Home</Text>} />
      <Tab.Screen name="Home" component={() => <Text>Home</Text>} /> */}
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