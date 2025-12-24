import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SearchIcon from '../../assets/icons/search.svg';
import { PunchStackParamList } from '../../navigation/PunchListNavigator';

type Props = NativeStackNavigationProp<PunchStackParamList, 'CreatePunchlist'>;

export default function CreatePunchlistScreen() {
  const navigation = useNavigation<Props>();

  const [searchQuery, setSearchQuery] = useState('');

  // ⭐ Dummy Job List
  const jobs = [
    {
      jobName: 'Wilson Bathroom Renovation',
      custName: 'Emily Wilson',
      phone: '1 (555) 101-2345',
    },
    {
      jobName: 'Wright Window Replacement',
      custName: 'Christopher Wright',
      phone: '1 (555) 232-3232',
    },
    {
      jobName: 'Smith Residence – Kitchen Remodel',
      custName: 'Daniel Smith',
      phone: '1 (555) 989-1212',
    },
  ];

  // ⭐ Search Filter
  const filteredJobs = jobs.filter(job =>
    job.jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.phone.includes(searchQuery)
  );

  return (
    <View className="flex-1 bg-bg_primary gap-y-4">
      {/* HEADER */}
      <View className="bg-white flex-row items-center px-6 py-4  border-b border-[#D8D9E0]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Create Punchlist
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

      <Text className='text-center w-full text-sm font-semibold'>Punch a job to create punchlist</Text>

      {/* JOB LIST */}
      <ScrollView className="px-6 ">
        {filteredJobs.map((job, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-xl p-4 mb-4 shadow-md"
          onPress={() =>
            navigation.navigate('PunchlistDetails', { job })
          }
          >
            <View className="mb-2">
              <Text className="text-base font-semibold text-black">
                Job Name : <Text className="font-normal">{job.jobName}</Text>
              </Text>
            </View>

            <Text className="text-base text-gray-700">
              Cust. Name : {job.custName}
            </Text>

            <Text className="text-base text-gray-700 mt-1">
              Phone : {job.phone}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
