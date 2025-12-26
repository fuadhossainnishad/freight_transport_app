import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ReadIcon from '../../assets/icons/read.svg'
import Read2Icon from '../../assets/icons/read2.svg'
import SettingsIcon from '../../assets/icons/settings.svg'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NotificationStackParamList } from '../../navigation/NotificationNavigator';

type Props = NativeStackNavigationProp<NotificationStackParamList, 'Notifications'>

export default function NotificationScreen() {
  const navigation = useNavigation<Props>()
  return (
    <View style={styles.container}>
      <View className=" w-full flex-row items-center gap-3 px-6 py-4 border-b border-b-[#D8D9E0] bg-white">
        <Text className="flex-1 text-2xl font-medium text-black text-center w-full">
          Notification
        </Text>
        <View className='flex-row gap-2 absolute justify-end items-center' style={styles.icons}>
          <ReadIcon width={24} height={24} />
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} className="p-2">
            <SettingsIcon width={24} height={24} />
          </TouchableOpacity></View>
      </View>

      <ScrollView
        className='bg-bg_primary flex-1 p-4'
        contentContainerStyle={styles.listView}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <List key={i} />
        ))}

      </ScrollView>
    </View>
  );
};

function List() {
  return (
    <View className=' flex-row gap-3  bg-white overflow-scroll p-3 rounded-x'>
      <Read2Icon width={28} height={28} style={styles.icons2} />
      <View className='flex-1 flex-shrink gap-1'>
        <Text className='' style={styles.text}>Daily Report Uploaded</Text>
        <Text className='text-sm' style={styles.text}>Daily report submitted with 5 photos showing the
          progress of the kitchen remodel.</Text>
        <Text className='text-sm text-gray-500'>2 hours ago</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icons: {
    right: 16
  },
  icons2: {
    marginTop: 4
  },
  listView: {
    gap: 16,
    paddingBottom: 24
  },
  text: {

  }
});