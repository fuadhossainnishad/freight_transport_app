import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';


import Home from '../../assets/icons/home.svg';
import HomeInline from '../../assets/icons/home_inactive.svg';
import Shipments from '../../assets/icons/shipments.svg';
import ShipmentsInline from '../../assets/icons/shipments_inactive.svg';
import AvailableBids from '../../assets/icons/bids.svg';
import AvailableBidsInline from '../../assets/icons/bids_inactive.svg';
import Settings from '../../assets/icons/settings.svg';
import SettingsInline from '../../assets/icons/settings_inactive.svg';
import Earning from '../../assets/icons/earning_inactive.svg';
import EarningInline from '../../assets/icons/earning2.svg';
import { TransporterTabParamList } from './types';
import SettingsStack from './SettingsStack';
import AvailableBidsStack from './AvailableBidsStack';
import ActiveShipmentsStack from './ActiveShipmentsStack';
import TransporterHomeStack from './TransporterHomeStack';
import EarningsStack from './EarningsStack';

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
    case 'HomeStack':
      IconComponent = focused ? Home : HomeInline;
      label = 'Home';
      break;
    case 'AvailableBids':
      IconComponent = focused ? AvailableBids : AvailableBidsInline;
      label = 'Available Bids';
      break;
    case 'Shipments':
      IconComponent = focused ? Shipments : ShipmentsInline;
      label = 'Shipments';
      break;
    case 'Earning':
      IconComponent = focused ? Earning : EarningInline;
      label = 'Earning';
      break;
    case 'Settings':
      IconComponent = focused ? Settings : SettingsInline;
      label = 'Settings';
      break;
  }

  return (
    <View
      className={` items-center justify-center rounded-full px-4 w-32 leading-5`}
    >
      {IconComponent && <IconComponent width={24} height={24} />}
      <Text className={`${focused ? "text-[#036BB4]" : "text-black"} text-xs font-medium`}>{label}</Text>
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
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: renderTabIcon(route),
      })}
    >
      <Tab.Screen name="HomeStack" component={TransporterHomeStack} />
      <Tab.Screen name="AvailableBids" component={AvailableBidsStack} />
      <Tab.Screen name="Shipments" component={ActiveShipmentsStack} />
      <Tab.Screen name="Earning" component={EarningsStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
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
    paddingHorizontal: 0,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    height: 70,
  },
});