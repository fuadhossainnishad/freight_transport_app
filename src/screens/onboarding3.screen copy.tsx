import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding3'>;

export default function OnboardingScreen3({ navigation }: Props) {
  return (
    <View className="flex-1 bg-white text-black pt-10">
      <View className="px-4">
        <Text className="text-lg font-bold mb-2">
          Keep Expense Records Clean{' '}
        </Text>
        <Text className="text-base font-normal">
          Upload material and purchase receipts in seconds - no paperwork needed
        </Text>
      </View>
      <View className="w-full h-[400px] items-center justify-center mt-20">
        <Image
          source={require('../assets/images/onboard3.png')}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      <LinearGradient
        colors={['#C09050', '#FFFFFF']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        className="w-full h-[300px] justify-center"
      >
        <View className="flex flex-row justify-between px-8">
          <TouchableOpacity onPress={() => navigation.navigate('Onboarding2')}>
            <Text className="text-lg font-semibold">GO BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-lg font-semibold">START</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-full">
            <Text className="font-semibold text-lg">Next</Text>
          </TouchableOpacity> */}
        </View>
      </LinearGradient>
    </View>
  );
}
