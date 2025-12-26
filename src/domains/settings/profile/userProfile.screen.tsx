import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import AppHeader from '../../../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../../navigation/SettingsNavigator';

type Props = NativeStackNavigationProp<SettingsStackParamList, 'Profile'>;

export default function UserProfileScreen() {
  const navigation = useNavigation<Props>();

  return (
    <View className="flex-1 bg-bg_primary">
      <AppHeader title="My Profile" onBack={() => navigation.goBack()} />

      <ScrollView className="p-6 bg-white m-6 rounded-xl">
        <View className="flex-row justify-center items-center rounded-full mb-6">
          <Image
            source={require('../../../assets/images/profile.png')}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        {/* USER ID */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">User ID</Text>
          <Text className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black">
            659425874
          </Text>
        </View>

        {/* USER ROLE */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">User Role</Text>
          <Text className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black">
            Owner
          </Text>
        </View>

        {/* FULL NAME */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">Full Name</Text>
          <Text className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black">
            Alex Smith
          </Text>
        </View>

        {/* EMAIL */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">Email</Text>
          <Text className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black">
            alexsmith@gmail.com
          </Text>
        </View>

        {/* PHONE */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">Phone Number</Text>
          <Text className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black">
            1 (555) 123-4567
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="bg-[#B09050] py-4 rounded-full mb-6 mx-6"
        onPress={() => navigation.navigate('EditUserProfile')}
      >
        <Text className="text-center text-white font-normal text-lg">
          Edit Profile Info
        </Text>
      </TouchableOpacity>
    </View>
  );
}
