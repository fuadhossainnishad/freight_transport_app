import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobStackParamList } from '../../navigation/JobNavigator';

import CalenderIcon from '../../assets/icons/calender.svg';
import CopyIcon from '../../assets/icons/copy.svg';
import ThreeDotIcon from '../../assets/icons/threedot.svg';
import SearchIcon from '../../assets/icons/search.svg';

import { copyData } from '../../utils/CopyData.utils';
import { CommonAction } from '../../components/Actions';
import { DynamicLabeling } from '../../utils/DynamicLabeling.utils';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = NativeStackNavigationProp<JobStackParamList, 'JobList'>;

export default function JobListScreen() {
  const navigation = useNavigation<Props>();
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Show the picker
  const showPicker = () => setShowDatePicker(true);

  // Handle date selection
  const onChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS keeps it open, Android closes automatically
    if (selectedDate) setDate(selectedDate);
  };
  // Track which job's action menu is open
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);

  const jobs = [
    {
      id: '1',
      date: '19 Aug 2025, 10:06 PM',
      jobName: 'Smith Residence – Kitchen Remodel',
      custName: 'John Smith',
      phone: '1 (555) 101-2345',
      email: 'john.smith@gmail.com',
      address: '452 Oakwood Dr, Dallas, TX 75201',
      creator: 'Emily Johnson',
      status: 'Completed',
    },
    {
      id: '2',
      date: '14 Aug 2025, 07:29 PM',
      jobName: 'Wilson Bathroom Renovation',
      custName: 'Emily Wilson',
      phone: '1 (555) 202-3456',
      email: 'emily.wilson@gmail.com',
      address: '789 Pine St, Austin, TX 73301',
      creator: 'Emily Davis',
      status: 'Pending',
    },
    {
      id: '3',
      date: '16 Aug 2025, 09:36 PM',
      jobName: 'Anderson Roof Replacement',
      custName: 'Daniel Anderson',
      phone: '1 (555) 303-4567',
      email: 'daniel.anderson@gmail.com',
      address: '123 Cedar Ave, Houston, TX 77002',
      creator: 'Daniel Clark',
      status: 'Pending',
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
          Job List
        </Text>

        <View className="w-8" />
      </View>

      {/* SEARCH BAR */}
      <View className="px-6  flex-row items-center gap-5">
        <View className="flex-1 flex-row items-center bg-white rounded-lg px-4 py-2">
          <SearchIcon height={16} width={16} className="" />

          <TextInput
            className="ml-2 text-base"
            placeholder="Search here..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          onPress={showPicker}
          className="bg-white p-3 rounded-lg"
        >
          <CalenderIcon height={20} width={20} className="" />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* JOB LIST */}
      <ScrollView className="px-6 mt-4" showsVerticalScrollIndicator={false}>
        {jobs.map((job, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-4 rounded-xl mb-5 shadow-md relative"
            onPress={() => {
              navigation.navigate('JobDetails', { job: job });
            }}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-gray-500 bg-bg_primary py-2 px-4 rounded-full ">
                {job.date}
              </Text>

              <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={() => copyData(job)}>
                  <CopyIcon width={24} height={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setOpenActionIndex(openActionIndex === index ? null : index)
                  }
                  className=""
                >
                  <ThreeDotIcon width={16} height={16} />
                </TouchableOpacity>

                {/* DROPDOWN MENU */}
                {openActionIndex === index && (
                  <View style={styles.dropdown}>
                    <CommonAction />
                  </View>
                )}
              </View>
            </View>

            <DynamicLabeling job={job} skipKeys={['id', 'status', 'date']} />
          </TouchableOpacity>
        ))}

        {/* FLOATING CREATE BUTTON */}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('CreateJob')}
        className=" bg-[#B09050] px-6 py-4 rounded-full shadow-lg"
        style={styles.btn}
      >
        <Text className="text-black text-center font-normal text-lg">
          Create New Job
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
  },
});
