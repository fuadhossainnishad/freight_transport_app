import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';

import HomeStack from './HomeStack';
import AvailableBidsStack from './AvailableBidsStack';
import ShipmentsStack from './ShipmentsStack';
import EarningStack from './EarningStack';
import SettingsStack from './SettingsStack';

export type TransporterTabParamList = {
  HomeStack: undefined;
  AvailableBidsStack: undefined;
  ShipmentsStack: undefined;
  EarningStack: undefined;
  SettingsStack: undefined;
};

const TabList = [
  {
    name: 'HomeStack',
    title: 'Home',
    component: HomeStack,
    inactiveIcon: require('../assets/icons/home-inactive.png'),
    activeIcon: require('../assets/icons/home-active.png'),
  },
  {
    name: 'AvailableBidsStack',
    title: 'Available Bids',
    component: AvailableBidsStack,
    inactiveIcon: require('../assets/icons/bids-inactive.png'),
    activeIcon: require('../assets/icons/bids-active.png'),
  },
  {
    name: 'ShipmentsStack',
    title: 'Shipments',
    component: ShipmentsStack,
    inactiveIcon: require('../assets/icons/shipments-inactive.png'),
    activeIcon: require('../assets/icons/shipments-active.png'),
  },
  {
    name: 'EarningStack',
    title: 'Earning',
    component: EarningStack,
    inactiveIcon: require('../assets/icons/earning-inactive.png'),
    activeIcon: require('../assets/icons/earning-active.png'),
  },
  {
    name: 'SettingsStack',
    title: 'Settings',
    component: SettingsStack,
    inactiveIcon: require('../assets/icons/settings-inactive.png'),
    activeIcon: require('../assets/icons/settings-active.png'),
  },
];

const DEFAULT_TAB_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: '#007AFF',
  tabBarInactiveTintColor: '#8E8E93',
  tabBarStyle: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBarIconStyle: {
    marginBottom: 4,
  },
} as const;

const Tab = createBottomTabNavigator<TransporterTabParamList>();

const renderTabIcon =
  (inactiveIcon: any, activeIcon: any) =>
  ({ focused, size }) => (
    <Image
      source={focused ? activeIcon : inactiveIcon}
      style={[styles.tabIcon, { width: size, height: size }]}
      resizeMode="contain"
    />
  );

export default function TransporterTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';
        const hiddenRoutes: string[] = []; // add any screens where tab bar should hide

        const shouldHideTabBar = hiddenRoutes.includes(routeName);

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: shouldHideTabBar
            ? { display: 'none' }
            : {
                // // height:100,
                borderRadius: 20,
                // gap: 2,
                // backgroundColor: 'none',
                // // backgroundColor: '#1D35571A',
                margin: 20,
                // marginTop:40,
                // alignItems: 'center',
                paddingTop: 34,
                backgroundColor: '#1D35578A',
                borderTopWidth: 0,
                position: 'absolute',
                alignItems: 'center',
                left: 50,
                right: 50,
                bottom: 20,
                height: 62,
              },
          tabBarItemStyle: styles.tabBarItemStyle,
          // tabBarIconStyle: styles.tabBarIconStyle,
        };
      }}
    >
      {TabList.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name as keyof MainTabParamList}
          component={tab.component}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color }) => {
              const IconComponent = focused ? tab.activeIcon : tab.inactiveIcon;
              const iconSize = 80;
              return <IconComponent width={iconSize} height={iconSize} />;
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    tintColor: undefined,
  },
});
