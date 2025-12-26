import { Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import {
  BusinessSettingsArray,
  OthersSettingsArray,
  SettingItem,
} from '../../constants/settings.constant';
import ArrowIcon from '../../assets/icons/arrow.svg';
import LogoutIcon from '../../assets/icons/logout.svg';
import { SettingsStackParamList } from '../../navigation/SettingsNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<Props>();

  const handlePress = (item: SettingItem) => {
    if (item.route === 'InfoScreen') {
      navigation.navigate(item.route, item.params);
    } else {
      navigation.navigate(item.route);
    }
  };

  return (
    <View className="flex-1">
      <View className="bg-white flex-row items-center px-6 py-4 mb-6 border-b border-b-[#D8D9E0]">
        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Account & Settings
        </Text>

        <View className="w-8" />
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('UserProfile');
        }}
        className=" flex-row justify-between items-center bg-white p-3 rounded-lg mx-4 mb-4"
      >
        <View className="flex-row gap-3 items-center ">
          <Image
            source={require('../../assets/images/profile.png')}
            className="w-16 h-16"
            resizeMode="contain"
          />
          <View>
            <Text className="text-base font-semibold">Alex Smith</Text>
            <Text className="text-sm">Owner</Text>
          </View>
        </View>
        <ArrowIcon className="" width={12} height={12} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mx-4 gap-y-1">
          <Text className="">Business Settings</Text>
          {BusinessSettingsArray.map((item, ind) => (
            <TouchableOpacity
              key={ind}
              className="flex-row justify-between items-center bg-white px-3 py-4 rounded-lg"
              onPress={() => handlePress(item)}
            >
              <View className="flex-row gap-3 items-center">
                {item.icon}
                <Text>{item.name}</Text>
              </View>
              <ArrowIcon width={12} height={12} />
            </TouchableOpacity>
          ))}
        </View>
        <View className="mx-4 mt-4 gap-y-1">
          <Text className="">Others</Text>
          {OthersSettingsArray.map((item, ind) => (
            <TouchableOpacity
              key={ind}
              className="flex-row justify-between items-center bg-white px-3 py-4 rounded-lg"
              onPress={() => handlePress(item)}
            >
              <View className="flex-row gap-3 items-center">
                {item.icon}
                <Text>{item.name}</Text>
              </View>
              <ArrowIcon width={12} height={12} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          className="mx-4 mt-8 mb-4 gap-y-1 flex-row items-center gap-5 bg-[#D8D9E0] px-3 py-4 rounded-lg"
          // onPress={navigation.navigate('')}
        >
          <LogoutIcon width={24} height={24} />
          <Text>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
