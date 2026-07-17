import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';


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

const BLUE = '#036BB4';

type SvgIcon = React.FC<{ width?: number; height?: number }>;

function svgTabIcon(Active: SvgIcon, Inactive: SvgIcon) {
  return function IconRenderer({ focused }: { focused: boolean }) {
    const Icon = focused ? Active : Inactive;
    return <Icon width={24} height={24} />;
  };
}

const Tab = createBottomTabNavigator<TransporterTabParamList>();

export default function TransporterTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  // insets.bottom is unreliable here (reports 0 on this device), so floor it.
  const bottomPad = Math.max(insets.bottom, 16);

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: '#000',
        tabBarLabelStyle: styles.label,
        tabBarStyle: [
          styles.tabBar,
          { height: 58 + bottomPad, paddingBottom: bottomPad },
        ],
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={TransporterHomeStack}
        options={{ tabBarLabel: t('nav.tabs.home'), tabBarIcon: svgTabIcon(Home, HomeInline) }}
      />
      <Tab.Screen
        name="AvailableBids"
        component={AvailableBidsStack}
        options={{ tabBarLabel: t('nav.tabs.bids'), tabBarIcon: svgTabIcon(AvailableBids, AvailableBidsInline) }}
      />
      <Tab.Screen
        name="Shipments"
        component={ActiveShipmentsStack}
        options={{ tabBarLabel: t('nav.tabs.shipments'), tabBarIcon: svgTabIcon(Shipments, ShipmentsInline) }}
      />
      <Tab.Screen
        name="Earning"
        component={EarningsStack}
        options={{ tabBarLabel: t('nav.tabs.earning'), tabBarIcon: svgTabIcon(Earning, EarningInline) }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarLabel: t('nav.tabs.settings'), tabBarIcon: svgTabIcon(Settings, SettingsInline) }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  label: { fontSize: 11, fontWeight: '500' },
});
