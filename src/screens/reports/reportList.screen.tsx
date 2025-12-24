import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { copyData } from '../../utils/CopyData.utils';
import { ReportStackParamList } from '../../navigation/ReportNavigator';

import FilterIcon from '../../assets/icons/filter.svg';

import SearchIcon from '../../assets/icons/search.svg';
import PhotosIcon from '../../assets/icons/photos.svg';
import VideosIcon from '../../assets/icons/videos.svg';
import CopyIcon from '../../assets/icons/copy.svg';

import { DynamicLabeling } from '../../utils/DynamicLabeling.utils';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackNavigationProp<ReportStackParamList, 'ReportList'>;

export default function ReportListScreen() {
  const navigation = useNavigation<Props>();
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showPicker = () => setShowDatePicker(true);

  const onChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS keeps open
    if (selectedDate) setDate(selectedDate);
  };

  const reports = [
    {
      reportId: '556865',
      date: '19 Aug 2025, 10:06 PM',
      jobName: 'Smith Residence – Kitchen Remodel',
      phone: '1 (555) 101-2345',
      reportCreator: 'Emily Johnson',
      photos: 2,
      videos: 3,
    },
    {
      reportId: '556866',
      date: '19 Aug 2025, 09:30 PM',
      jobName: 'Wilson Bathroom Renovation',
      phone: '1 (555) 202-3456',
      reportCreator: 'Emily Davis',
      photos: 1,
      videos: 1,
    },
    {
      reportId: '556867',
      date: '18 Aug 2025, 08:20 PM',
      jobName: 'Anderson Roof Replacement',
      phone: '1 (555) 303-4567',
      reportCreator: 'Daniel Clark',
      photos: 3,
      videos: 2,
    },
  ];

  return (
    <View className="flex-1 bg-bg_primary">
      <View className="bg-white flex-row items-center px-6 py-4 mb-6 border-b border-b-[#D8D9E0]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Job List
        </Text>

        <View className="w-8" />
      </View>

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
          <FilterIcon height={20} width={20} className="" />
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

      {/* REPORTS LIST */}
      <ScrollView className="px-6 mt-4" showsVerticalScrollIndicator={false}>
        {reports.map((item, index) => (
          <View key={index} className="bg-white p-4 rounded-xl mb-5 shadow-md">
            {/* Top Row */}
            <View className="flex-row justify-between">
              <Text
                className="text-gray-500 bg-bg_primary px-4 py-2 rounded-full"
                style={styles.reportDate}
              >
                {item.date}
              </Text>
              <TouchableOpacity onPress={() => copyData(item)}>
                <CopyIcon width={26} height={26} />
              </TouchableOpacity>
            </View>

            <DynamicLabeling
              job={item}
              skipKeys={['image', 'videos', 'photos', 'id', 'date']}
            />

            {/* Photos & Videos */}
            <View className="flex-row gap-4 mt-4">
              <View className="items-center flex-row gap-2">
                <PhotosIcon height={30} width={30} />
                <Text className="text-xl font-bold">{item.photos}</Text>
                <Text className="text-sm text-gray-500">Photos</Text>
              </View>

              <View className="items-center flex-row gap-2">
                <VideosIcon height={30} width={30} />
                <Text className="text-xl font-bold">{item.videos}</Text>
                <Text className="text-sm text-gray-500">Videos</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Reusable Report Detail Component
// const ReportDetail = ({ label, value }: { label: string; value: string }) => (
//   <View className="mt-3 flex-row flex-wrap gap-1">
//     <Text className="text-gray-700 font-medium">{label}</Text>
//     <Text className="font-semibold">{value}</Text>
//   </View>
// );

const styles = StyleSheet.create({
  reportDate: {
    alignSelf: 'flex-start',
  },
  scroll: {
    gap: 4,
  },
});
