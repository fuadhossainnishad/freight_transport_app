import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import AppHeader from '../../../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../../navigation/SettingsNavigator';

type Props = NativeStackNavigationProp<SettingsStackParamList, 'Profile'>;

export default function CompanyProfileScreen() {
  const navigation = useNavigation<Props>();

  return (
    <View className="flex-1 bg-bg_primary">
      <AppHeader title="Company Profile" onBack={() => navigation.goBack()} />

      <ScrollView className="p-6 bg-white m-6 rounded-xl">
        <View className=" flex-row justify-center items-center rounded-full mb-4">
          <Image
            source={require('../../../assets/images/logo.png')}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>
        <View className="mb-4 gap-y-3">
          <Text className="text-gray-600">Company Name</Text>
          <Text className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black">
            ClearSite
          </Text>
        </View>

        <View className="mb-4 gap-y-3">
          <Text className="text-gray-600">Email</Text>
          <Text className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black">
            clearsite@gmail.com
          </Text>
        </View>

        <View className="mb-4 gap-y-3">
          <Text className="text-gray-600">Phone Number</Text>
          <Text className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black">
            1 (555) 123-4567
          </Text>
        </View>

        <View className="mb-4 gap-y-3">
          <Text className="text-gray-600">Address</Text>
          <Text className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black">
            128 Maple Rd, Fort Worth, TX 76102
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        className="bg-[#B09050] py-4 rounded-full mb-6 mx-6 "
        onPress={() => {
          navigation.navigate('EditProfile');
        }}
      >
        <Text className="text-center  font-normal text-lg">
          Edit Profile Info
        </Text>
      </TouchableOpacity>
    </View>
  );
}
