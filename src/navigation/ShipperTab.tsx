import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';


import Home from '../../assets/icons/home.svg';
import HomeInline from '../../assets/icons/home_inactive.svg';
import Shipments from '../../assets/icons/shipments.svg';
import ShipmentsInline from '../../assets/icons/shipments_inactive.svg';
import Invoice from '../../assets/icons/invoice.svg';
import InvoiceInline from '../../assets/icons/invoice_inactive.svg';
import Settings from '../../assets/icons/settings.svg';
import SettingsInline from '../../assets/icons/settings_inactive.svg';
import { ShipperTabParamList } from './types';
import ShipperHome from '../presentation/shipper/screens/ShipperHome.screen';
import ShipperHomeStack from './ShipperHomeStack';
import SettingsStack from './SettingsStack';

/* ----------------------------------------------
   TYPE DEFINITIONS
---------------------------------------------- */

type TabIconProps = {
  routeName: keyof ShipperTabParamList;
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
    case 'Shipments':
      IconComponent = focused ? Shipments : ShipmentsInline;
      label = 'Shipments';
      break;
    case 'Invoices':
      IconComponent = focused ? Invoice : InvoiceInline;
      label = 'Invoices';
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
      <Text className={`${focused ? "text-[#036BB4]" : "text-black"} text-sm font-medium`}>{label}</Text>
    </View>
  );
}

/* ----------------------------------------------
   STABLE FUNCTION TO AVOID NESTED COMPONENTS
---------------------------------------------- */
function renderTabIcon(
  route: RouteProp<ShipperTabParamList, keyof ShipperTabParamList>,
) {
  return function IconRenderer({ focused }: { focused: boolean }) {
    return <TabIcon routeName={route.name} focused={focused} />;
  };
}

/* ----------------------------------------------
   BOTTOM TAB NAVIGATOR
---------------------------------------------- */
const Tab = createBottomTabNavigator<ShipperTabParamList>();

export default function ShipperTabs() {
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
      <Tab.Screen name="HomeStack" component={ShipperHomeStack} />
      <Tab.Screen name="Shipments" component={ShipperHome} />
      <Tab.Screen name="Invoices" component={ShipperHome} />
      <Tab.Screen name="Settings" component={SettingsStack} />
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
    paddingHorizontal: 20,
    paddingBottom: 50,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    height: 100,
  },
});