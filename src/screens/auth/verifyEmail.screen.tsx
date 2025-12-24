import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For the back arrow
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VerifyEmailScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerifyEmail'
>;

export default function VerifyEmailScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<VerifyEmailScreenProp>();

  return (
    <View className="flex-1 bg-white  ">
      <View className="flex-row items-center px-6 py-4 mb-6 border-b border-b-[#D8D9E0]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Create New Account
        </Text>

        <View className="w-8" />
      </View>

      <View className="justify-between px-6">
        <View>
          <View className="mb-8">
            <Text className="text-2xl font-medium  text-black">
              Verify email
            </Text>
            <Text className="text-base mt-2">
              Please enter your email address to create new account. We’ll send
              a verification code.
            </Text>
          </View>

          <View className="bg-[#B09050]/10 p-4 rounded-lg mb-6">
            <View className="mb-4">
              <Text className=" mb-1">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-lg bg-white px-4 py-3 text-black"
                placeholder="Enter your email"
                placeholderTextColor="#62636C"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              className="bg-[#B09050] py-4 rounded-full mb-6"
              onPress={() => {
                navigation.navigate('VerifyOtp');
              }}
            >
              <Text className="text-center  font-normal text-lg">Get OTP</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Section */}
        <View>
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-3 text-gray-500">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Social Login */}
          <View className="items-center mb-6 ">
            <Text className="text-gray-500 mb-3">Continue with</Text>

            <View className="flex-row justify-between w-full">
              <TouchableOpacity className="flex-col items-center ">
                <Image
                  source={require('../../assets/images/google.png')}
                  className="w-7 h-7 mb-2"
                />
                <Text>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center ">
                <Image
                  source={require('../../assets/images/ms.png')}
                  className="w-7 h-7 mb-2"
                />
                <Text>Microsoft Outlook</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center ">
                <Image
                  source={require('../../assets/images/fb.png')}
                  className="w-7 h-7 mb-2"
                />
                <Text>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-col items-center justify-center gap-5">
            <Text className="text-gray-500">Already have an account?? </Text>
            <TouchableOpacity
              className="w-full "
              onPress={() => {
                navigation.navigate('Login');
              }}
            >
              <Text className=" font-semibold text-center border-[1px] border-[#423526] p-4 w-full rounded-full">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
