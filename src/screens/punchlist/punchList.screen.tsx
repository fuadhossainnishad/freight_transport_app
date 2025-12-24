import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CopyIcon from '../../assets/icons/copy.svg';
import ThreeDotIcon from '../../assets/icons/threedot.svg';
import SearchIcon from '../../assets/icons/search.svg';

import { copyData } from '../../utils/CopyData.utils';
import { PunchlistAction } from '../../components/Actions';
import { PunchStackParamList } from '../../navigation/PunchListNavigator';
import { DynamicLabeling } from '../../utils/DynamicLabeling.utils';

type Props = NativeStackNavigationProp<PunchStackParamList, 'PunchList'>;

export default function PunchListScreen() {
  const navigation = useNavigation<Props>();
  const [searchQuery, setSearchQuery] = useState('');
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);

  const punchs = [
    {
      punchlistId: 'PL-101',
      jobName: 'Smith Residence – Kitchen Remodel',
      date: '19 Aug 2025, 10:06 PM',
      phone: '1 (555) 101-2345',
      punchlistCreator: 'Emily Johnson',
      pending: 5,
      completed: 12,
      totalItem: 2,
    },
    {
      punchlistId: 'PL-102',
      jobName: 'Smith Residence – Kitchen Remodel',
      date: '14 Aug 2025, 07:29 PM',
      phone: '1 (555) 202-3456',
      punchlistCreator: 'Emily Davis',
      pending: 3,
      completed: 7,
      totalItem: 2,
    },
    {
      punchlistId: 'PL-103',
      jobName: 'Smith Residence – Kitchen Remodel',
      date: '16 Aug 2025, 09:36 PM',
      phone: '1 (555) 303-4567',
      punchlistCreator: 'Daniel Clark',
      pending: 8,
      completed: 20,
      totalItem: 2,
    },
  ];

  return (
    <View className="flex-1 bg-bg_primary">
      {/* HEADER */}
      <View className="bg-white flex-row items-center px-6 py-4 mb-6 border-b border-b-[#D8D9E0]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Punchlist Management
        </Text>

        <View className="w-8" />
      </View>

      {/* SEARCH BAR */}
      <View className="px-6 flex-row items-center gap-5">
        <View className="flex-1 flex-row items-center bg-white rounded-lg px-4 py-2">
          <SearchIcon height={16} width={16} />
          <TextInput
            className="ml-2 text-base"
            placeholder="Search here..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* LIST */}
      <ScrollView className="px-6 mt-4" showsVerticalScrollIndicator={false}>
        {punchs.map((punch, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-4 rounded-xl mb-5 shadow-md relative"
            onPress={() =>
              navigation.navigate('PunchlistDetails', { punchlist: punch })
            }
          >
            {/* TOP SECTION */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base text-gray-500 bg-bg_primary py-2 px-4 rounded-full">
                {punch.date}
              </Text>

              <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={() => copyData(punch)}>
                  <CopyIcon width={24} height={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setOpenActionIndex(openActionIndex === index ? null : index)
                  }
                >
                  <ThreeDotIcon width={16} height={16} />
                </TouchableOpacity>

                {openActionIndex === index && (
                  <View style={styles.dropdown}>
                    <PunchlistAction />
                  </View>
                )}
              </View>
            </View>

            <DynamicLabeling
              job={punch}
              skipKeys={['date', 'pending', 'completed', 'totalItem']}
            />

            <View className="flex-row items-center justify-between  mt-4">
              {Object.entries(punch)
                .filter(([key, _]) =>
                  ['completed', 'pending', 'totalItem'].includes(key),
                )
                .map(([key, value], ind) => (
                  <View
                    className="items-center flex-row gap-1 px-3 py-1 bg-[#423526]/10 rounded-full"
                    key={ind}
                  >
                    <Text className="text-base font-bold">{value}</Text>
                    <Text className="text-sm text-gray-500">
                      {key === 'completed'
                        ? 'Completed'
                        : key === 'pending'
                          ? 'Pending'
                          : 'Total Items'}
                    </Text>
                  </View>
                ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('CreatePunchlist')}
        className="bg-[#B09050] px-6 py-4 rounded-full shadow-lg"
        style={styles.btn}
      >
        <Text className="text-black text-center font-normal text-lg">
          Create Punchlist
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 0,
    zIndex: 999,
    elevation: 10,
    backgroundColor: 'white',
    padding: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  btn: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 20,
  },
});
