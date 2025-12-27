import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type TransporterMainTabParamalist = {
  HomeStack: undefined;
  AvailableBidsStack: undefined;
  ShipmentsStack: undefined;
  EarningStack: undefined;
  SettingsStack: undefined;
};

const Tab = [
  {
    name: 'Home',
    component: HomeStack,
    inactiveIcon: '',
    activeIcon: '',
  },
  {
    name: 'Available Bids',
    component: AvailableBidsStack,
    inactiveIcon: '',
    activeIcon: '',
  },
  {
    name: 'Shipments',
    component: ShipmentsStack,
    inactiveIcon: '',
    activeIcon: '',
  },
  {
    name: 'Earning',
    component: EarningStack,
    inactiveIcon: '',
    activeIcon: '',
  },
  {
    name: 'Settings',
    component: SettingsStack,
    inactiveIcon: '',
    activeIcon: '',
  },
];

const Tab = createBottomTabNavigator<TransporterMainTabParamalist>();
export default function TransporterTabs() {
  return <Tab.Navigator></Tab.Navigator>;
}
