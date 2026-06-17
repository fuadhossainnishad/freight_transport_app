import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
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

type TabIconProps = {
  routeName: keyof ShipperTabParamList;
  focused: boolean;
};

function TabIcon({ routeName, focused }: TabIconProps) {
  const { pendingCount } = usePaymentRequests();
  let IconComponent: React.FC<any> | null = null;
  let label = '';
  let isPayments = false;

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
    case 'Payments':
      isPayments = true;
      label = 'Payments';
      break;
    case 'Settings':
      IconComponent = focused ? Settings : SettingsInline;
      label = 'Settings';
      break;
  }

  return (
    <View style={styles.item}>
      <View>
        {isPayments ? (
          <CreditCard width={22} height={22} color={focused ? BLUE : '#1f2937'} />
        ) : (
          IconComponent && <IconComponent width={22} height={22} />
        )}

        {isPayments && pendingCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{pendingCount > 9 ? '9+' : pendingCount}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.label, { color: focused ? BLUE : '#111827' }]}>{label}</Text>
    </View>
  );
}

function renderTabIcon(
  route: RouteProp<ShipperTabParamList, keyof ShipperTabParamList>,
) {
  return function IconRenderer({ focused }: { focused: boolean }) {
    return <TabIcon routeName={route.name} focused={focused} />;
  };
}

const Tab = createBottomTabNavigator<ShipperTabParamList>();

export default function ShipperTabs() {
  return (
    <PaymentRequestsProvider>
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
        <Tab.Screen name="Shipments" component={ShipperShipmentsStack} />
        <Tab.Screen name="Invoices" component={InvoiceStack} />
        <Tab.Screen name="Payments" component={PaymentsStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </PaymentRequestsProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingBottom: 50,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    height: 100,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 64,
  },
  label: { fontSize: 11, fontWeight: '500' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTxt: { color: '#fff', fontSize: 9, fontWeight: '700' },
});
