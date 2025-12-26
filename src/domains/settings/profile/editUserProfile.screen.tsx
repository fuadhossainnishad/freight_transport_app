import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import AppHeader from '../../../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../../navigation/SettingsNavigator';
import { useState } from 'react';
import PhotoActionModal from '../../../components/modals/PhotoActionModal';
import ChoosePhotoIcon from '../../../assets/icons/choosePhoto.svg';

type Props = NativeStackNavigationProp<SettingsStackParamList, 'EditProfile'>;

export default function EditUserProfileScreen() {
  const navigation = useNavigation<Props>();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-bg_primary">
      <AppHeader title="Edit Profile Info" onBack={() => navigation.goBack()} />

      <ScrollView className="p-6 bg-white m-6 rounded-xl">
        {/* Profile Image */}
        <View className="flex-row justify-center items-center mb-6 relative">
          <Image
            source={require('../../../assets/images/profile.png')}
            className="w-24 h-24 rounded-full"
            resizeMode="contain"
          />
          <TouchableOpacity
            className="absolute bg-[#B09050] p-2 -bottom-4 ml-16 rounded-full"
            onPress={() => setModalVisible(!modalVisible)}
          >
            <ChoosePhotoIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* USER ID */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">User ID</Text>
          <TextInput
            value="659425874"
            editable={false}
            className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black"
          />
        </View>

        {/* USER ROLE */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">User Role</Text>
          <TextInput
            value="Owner"
            editable={false}
            className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black"
          />
        </View>

        {/* FULL NAME */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">Full Name</Text>
          <TextInput
            defaultValue="Alex Smith"
            className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black"
          />
        </View>

        {/* EMAIL */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">Email</Text>
          <TextInput
            defaultValue="alexsmith@gmail.com"
            className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black"
          />
        </View>

        {/* PHONE */}
        <View className="mb-4 gap-y-2">
          <Text className="text-gray-600">Phone Number</Text>
          <TextInput
            defaultValue="1 (555) 123-4567"
            className="border border-gray-300 rounded-lg bg-[#F9F9FB] px-4 py-3 text-black"
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="bg-[#B09050] py-4 rounded-full my-4 mx-6"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-center text-white font-normal text-lg">
          Save Changes
        </Text>
      </TouchableOpacity>

      {/* Photo Modal */}
      <PhotoActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onChooseGallery={() => console.log('Choose from Gallery')}
        onTakePhoto={() => console.log('Take Photo')}
        onRemovePhoto={() => console.log('Remove Photo')}
      />
    </View>
  );
}
