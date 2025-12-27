import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SwipIcon from '../../assets/icons/swipe.svg';
import JobsIcon from '../../assets/icons/job2.svg';
import ItemsIcon from '../../assets/icons/item.svg';

import Jobs2Icon from '../../assets/icons/jobs.svg';

import ReportIcon from '../../assets/icons/report.svg';

import ReceiptIcon from '../../assets/icons/receipt.svg';

import PunchlistIcon from '../../assets/icons/punchlist.svg';

import { HomeStackParamList } from '../../navigation/HomeNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Reports from '../../components/Reports';
import Receipts from '../../components/Receipts';

type Props = NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>;

export default function Home() {
  const navigation = useNavigation<Props>();

  return (
    <View className="bg-[#F8EFE4]" style={styles.container}>
      <View className="flex-row items-center gap- px-6 py-2 mb-6 border-b border-b-[#D8D9E0] bg-white">
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          className="p-2"
        >
          <Image
            source={require('../../assets/images/logo.png')}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text className="flex-1 text-2xl font-bold text-black">ClearSite</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SwitchCompany')}
          className="p-2"
        >
          <SwipIcon height={24} width={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsHorizontalScrollIndicator={false} className="">
        <Dashboard />
        <Options />
        <Reports />
        <Receipts />
      </ScrollView>
    </View>
  );
}

function Dashboard() {
  return (
    <View className=" bg-white mx-4 mt-2 p-4 gap-2 rounded-lg">
      <Text className="text-lg font-semibold ">
        Active Jobs & Punchlist Overview
      </Text>

      <View className="flex-row gap-4">
        <View className="bg-bg_primary flex-1 p-4 rounded-xl relative">
          <View className="absolute top-0 right-0">
            <JobsIcon width={40} height={40} />
          </View>
          <Text className="text-lg font-semibold mb-2">105</Text>
          <Text className="text-base font-semibold mb-2 text-[#62636C]">
            Total Jobs
          </Text>

          <View className="flex-row justify-between">
            <View className="">
              <Text className="font-semibold text-orange-600 self-center">
                6
              </Text>
              <Text className="text-sm text-gray-600">Pending</Text>
            </View>
            <View className=" mb-1">
              <Text className="font-semibold text-green-600 self-center">
                12
              </Text>
              <Text className="text-sm text-gray-600">Completed</Text>
            </View>
          </View>
        </View>

        <View className="bg-bg_primary flex-1 p-4 rounded-xl relative">
          <View className="absolute top-0 right-0">
            <ItemsIcon width={40} height={40} />
          </View>

          <Text className="text-lg font-semibold mb-2">105</Text>

          <Text className="text-base font-semibold mb-2 text-[#62636C]">
            Total Bullet Item
          </Text>

          <View className="flex-row justify-between">
            <View className="">
              <Text className="font-semibold text-orange-600 self-center">
                6
              </Text>
              <Text className="text-sm text-gray-600">Pending</Text>
            </View>
            <View className=" mb-1">
              <Text className="font-semibold text-green-600 self-center">
                12
              </Text>
              <Text className="text-sm text-gray-600">Completed</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function Options() {
  const links = [
    {
      id: 1,
      title: 'Jobs',
      route: 'Job',
      icon: <Jobs2Icon width={52} height={52} />,
    },
    {
      id: 2,
      title: 'Daily Reports',
      route: 'Reports',
      icon: <ReportIcon width={52} height={52} />,
    },
    {
      id: 3,
      title: 'Punchlist',
      route: 'Punchlist',
      icon: <PunchlistIcon width={52} height={52} />,
    },
    {
      id: 4,
      title: 'Receipt',
      route: 'Job',
      icon: <ReceiptIcon width={52} height={52} />,
    },
  ];

  const navigation = useNavigation<Props>();

  return (
    <View className="bg-white p-4 mx-4 mt-4 rounded-xl">
      <Text className="text-lg font-semibold mb-4">Quick Links</Text>

      <View className="" style={styles.quickLinks}>
        {links.map(item => (
          <TouchableOpacity
            key={item.id}
            className="items-center gap-2"
            onPress={() => {
              navigation.navigate(item.route as keyof HomeStackParamList);
            }}
          >
            {/* Icon box */}
            {item.icon}

            {/* Title */}
            <Text className="text-sm font-medium text-gray-700 text-center ">
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconImage: {
    width: 32,
    height: 32,
  },
  quickLinks: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});
