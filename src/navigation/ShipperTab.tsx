import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react-native';


import Home from '../../assets/icons/home.svg';
import HomeInline from '../../assets/icons/home_inactive.svg';
import Shipments from '../../assets/icons/shipments.svg';
import ShipmentsInline from '../../assets/icons/shipments_inactive.svg';
import Invoice from '../../assets/icons/invoice.svg';
import InvoiceInline from '../../assets/icons/invoice_inactive.svg';
import Settings from '../../assets/icons/settings.svg';
import SettingsInline from '../../assets/icons/settings_inactive.svg';
import { ShipperTabParamList } from './types';
import ShipperHomeStack from './ShipperHomeStack';
import SettingsStack from './SettingsStack';
import ShipperShipmentsStack from './ShipperShipmentsStack';
import InvoiceStack from './InvoiceStack';
import PaymentsStack from './PaymentsStack';
import { PaymentRequestsProvider, usePaymentRequests } from '../presentation/payment/PaymentRequestsContext';

const BLUE = '#036BB4';

type SvgIcon = React.FC<{ width?: number; height?: number }>;

function svgTabIcon(Active: SvgIcon, Inactive: SvgIcon) {
  return function IconRenderer({ focused }: { focused: boolean }) {
    const Icon = focused ? Active : Inactive;
    return <Icon width={22} height={22} />;
  };
}

const Tab = createBottomTabNavigator<ShipperTabParamList>();

function ShipperTabsInner() {
  const { t } = useTranslation();
  const { pendingCount } = usePaymentRequests();
  const insets = useSafeAreaInsets();
  // insets.bottom is unreliable here (reports 0 on this device), so floor it.
  const bottomPad = Math.max(insets.bottom, 16);

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: '#111827',
        tabBarLabelStyle: styles.label,
        tabBarStyle: [
          styles.tabBar,
          { height: 58 + bottomPad, paddingBottom: bottomPad },
        ],
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={ShipperHomeStack}
        options={{ tabBarLabel: t('nav.tabs.home'), tabBarIcon: svgTabIcon(Home, HomeInline) }}
      />
      <Tab.Screen
        name="Shipments"
        component={ShipperShipmentsStack}
        options={{ tabBarLabel: t('nav.tabs.shipments'), tabBarIcon: svgTabIcon(Shipments, ShipmentsInline) }}
      />
      <Tab.Screen
        name="Invoices"
        component={InvoiceStack}
        options={{ tabBarLabel: t('nav.tabs.invoices'), tabBarIcon: svgTabIcon(Invoice, InvoiceInline) }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentsStack}
        options={{
          tabBarLabel: t('nav.tabs.payments'),
          tabBarBadge: pendingCount > 0 ? (pendingCount > 9 ? '9+' : pendingCount) : undefined,
          tabBarIcon: ({ focused }) => (
            <CreditCard width={22} height={22} color={focused ? BLUE : '#1f2937'} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarLabel: t('nav.tabs.settings'), tabBarIcon: svgTabIcon(Settings, SettingsInline) }}
      />
    </Tab.Navigator>
  );
}

export default function ShipperTabs() {
  return (
    <PaymentRequestsProvider>
      <ShipperTabsInner />
    </PaymentRequestsProvider>
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
