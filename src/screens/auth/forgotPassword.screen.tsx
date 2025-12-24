import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For the back arrow
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ForgotPasswordScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<ForgotPasswordScreenProp>();

  return (
    <View className="flex-1 bg-white  ">
      <View className="flex-row items-center px-6 py-4 mb-6 border-b border-b-[#D8D9E0]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Forgot Password?
        </Text>

        <View className="w-8" />
      </View>

      <View className="justify-between px-6">
        <View>
          <View className="mb-8">
            <Text className="text-2xl font-medium  text-black">
              Don’t Panic!{' '}
            </Text>
            <Text className="text-base mt-2">
              Please enter your registered email to get OTP
            </Text>
          </View>

          <View className="bg-[#B09050]/10 p-4 rounded-lg mb-6">
            <View className="mb-4">
              <Text className=" mb-1">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-lg bg-white px-4 py-3 text-black"
                placeholder="Enter your email address"
                placeholderTextColor="#62636C"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              className="bg-[#B09050] py-4 rounded-full mb-6"
              onPress={() => {
                navigation.navigate('VerifyOtp2');
              }}
            >
              <Text className="text-center  font-normal text-lg">Get OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
