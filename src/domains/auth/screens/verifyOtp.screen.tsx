import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VerifyOtpScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerifyOtp'
>;

export default function VerifyOtpScreen() {
  const navigation = useNavigation<VerifyOtpScreenProp>();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(RNTextInput | null)[]>([]);
  const [timer, setTimer] = useState(35);

  // -------- TIMER ----------
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    if (text.length === 1 && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (text.length === 0 && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-1 bg-[#B09050]/5">
      {/* ----- Header ----- */}
      <View className="flex-row items-center px-6 py-2 bg-white border-b border-b-[#D8D9E0]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Create New Account
        </Text>

        <View className="w-8" />
      </View>

      {/* ----- Card ----- */}
      <View className="p-4 border-[1px] m-4 border-[#D8D9E0] bg-white rounded-2xl">
        {/* Title */}
        <View className="mb-8">
          <Text className="text-2xl font-medium text-black mb-2">
            OTP Verification
          </Text>
          <Text className="text-base">
            We’ve sent a code to your email. Enter it below to continue.
          </Text>
        </View>

        {/* -------- OTP INPUT BOXES -------- */}
        <View className="flex-row justify-between mb-6">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              autoFocus={index === 0}
              ref={ref => {
                inputs.current[index] = ref;
              }}
              className="border border-[#B09050] rounded-xl w-14 h-14 text-center text-lg"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          className="bg-[#B09050] py-4 rounded-full mb-4"
          onPress={() => {
            navigation.navigate('Signup');
          }}
        >
          <Text className="text-center font-normal text-lg">Verify OTP</Text>
        </TouchableOpacity>

        {/* Resend */}
        <View className="flex-row justify-center mt-2">
          <Text className="mr-2">Didn’t get OTP?</Text>
          <TouchableOpacity disabled={timer > 0}>
            <Text
              className={`text-[#B09050] font-semibold ${timer > 0 ? 'opacity-50' : ''
                }`}
            >
              Resend {timer > 0 ? `in ${timer}s` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
