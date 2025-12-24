import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';

type SignupScreensProps = NativeStackNavigationProp<
  RootStackParamList,
  'Signup'
>;

type RouteParams = RouteProp<RootStackParamList, 'Signup'>;

export default function SignupScreen() {
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [ownerPhoto, setOwnerPhoto] = useState<string | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  const navigation = useNavigation<SignupScreensProps>();
  const router = useRoute<RouteParams>();
  const appColor = router.params?.selectedColor! || '#B09050';

  // useEffect(() => {
  //   setAppColor(router.params?.selectedColor!)
  // }, [])

  const pickImage = (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri!);
      }
    });
  };

  return (
    <ScrollView className="flex-1 bg-[#B09050]/20">
      {/* Header */}
      <View className="flex-row bg-white items-center px-6 py-2 border-b border-b-[#D8D9E0]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Create New Account
        </Text>
        <View className="w-8" />
      </View>

      <View className="m-4 bg-white p-4 rounded-xl">
        <View className="mb-6">
          <Text className="text-2xl font-medium text-black">
            Almost Finished!
          </Text>
          <Text className="mt-2">
            Set up your company details & password to finish sign up process
          </Text>
        </View>

        {/* Form Fields */}
        <View className="rounded-lg mb-6">
          {/* Company Name */}
          <View className="mb-4">
            <Text className="mb-1">Company Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg bg-white px-4 py-3 text-black"
              placeholder="e.g., Skyline construction group"
              placeholderTextColor="#62636C"
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>

          {/* Owner Name */}
          <View className="mb-4">
            <Text className="mb-1">Owner Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg bg-white px-4 py-3 text-black"
              placeholder="e.g., Alex Smith"
              placeholderTextColor="#62636C"
              value={ownerName}
              onChangeText={setOwnerName}
            />
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="mb-1">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg bg-white px-4 py-3 text-black"
              placeholder="e.g., 1 (555) 567-8901"
              placeholderTextColor="#62636C"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Address */}
          <View className="mb-4">
            <Text className="mb-1">Address</Text>
            <TextInput
              className="border border-gray-300 rounded-lg bg-white px-4 py-3 text-black"
              placeholder="e.g., 4500 Sunset Blvd, Los Angeles, CA 90027"
              placeholderTextColor="#62636C"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="mb-1">Password</Text>
            <View className="border border-gray-300 rounded-lg bg-white px-4 flex-row items-center">
              <TextInput
                className="flex-1 py-3 text-black"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                placeholderTextColor="#62636C"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#62636C"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View className="mb-4">
            <Text className="mb-1">Confirm Password</Text>
            <View className="border border-gray-300 rounded-lg bg-white px-4 flex-row items-center">
              <TextInput
                className="flex-1 py-3 text-black"
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#62636C"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#62636C"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Upload Section */}
          <View className="flex-row justify-between mb-6">
            {/* Owner Photo */}
            <View className="gap-2">
              <Text className="mb-1">Owner Photo</Text>
              <TouchableOpacity
                className="items-center border-[1px] border-[#80828D] rounded-lg p-4 px-6"
                onPress={() => pickImage(setOwnerPhoto)}
              >
                <View className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center mb-2">
                  {ownerPhoto ? (
                    <Image
                      source={{ uri: ownerPhoto }}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <Icon name="person" size={24} color="#62636C" />
                  )}
                </View>
                <Text className="text-sm">Upload owner photo</Text>
              </TouchableOpacity>
            </View>

            {/* Company Logo */}
            <View className="gap-2">
              <Text className="mb-1">Company Logo</Text>
              <TouchableOpacity
                className="items-center border-[1px] border-[#80828D] rounded-lg p-4 px-6"
                onPress={() => pickImage(setCompanyLogo)}
              >
                <View className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center mb-2">
                  {companyLogo ? (
                    <Image
                      source={{ uri: companyLogo }}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <Icon name="image" size={24} color="#62636C" />
                  )}
                </View>
                <Text className="text-sm">Upload company logo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Color Picker */}
          <View className="mb-6">
            <Text className="mb-6">App Color</Text>
            <View
              style={{ backgroundColor: appColor }}
              className="h-16 w-16 rounded-full self-center"
            />
            <TouchableOpacity
              className="items-center flex-row self-center mt-2"
              onPress={() => {
                navigation.navigate('ColorPicker');
              }}
            >
              <Image
                source={require('../../assets/icons/change.png')}
                className="w-7 h-7"
                resizeMode="contain"
              />
              <Text
                className="underline-offset-4 underline"
                style={styles.underlineText}
              >
                Change App Color
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms & Conditions */}
          <View className="mb-6">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setRemember(!remember)}
            >
              <View
                className={`w-5 h-5 rounded border ${
                  remember ? 'bg-[#B09050] border-[#B09050]' : 'border-gray-400'
                }`}
              />
              <Text className="ml-2">
                I agree to the Privacy Policy and Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className=" py-4 rounded-full"
            style={[styles.buttonBg, { backgroundColor: appColor }]}
          >
            <Text className="text-center font-normal text-lg">
              Create new account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  underlineText: {
    textDecorationLine: 'underline',
    textDecorationColor: '#000',
    textDecorationStyle: 'solid',
    textUnderlineOffset: 12,
  } as TextStyle,
  buttonBg: {},
});
