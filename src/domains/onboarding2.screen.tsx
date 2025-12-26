import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding2'>;

export default function OnboardingScreen2({ navigation }: Props) {
  return (
    <View className="flex-1 bg-white text-black pt-10">
      <View className="px-4">
        <Text className="text-lg font-bold mb-2">
          Stay Updated with Field Reports{' '}
        </Text>
        <Text className="text-base font-normal">
          Daily reports and punchlist items - submitted fast and in real time
        </Text>
      </View>
      <View className="w-full h-[400px] items-center justify-center mt-20">
        <Image
          source={require('../assets/images/onboard2.png')}
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
        <View className="flex flex-row items-end justify-between px-8">
          <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
            <Text className="text-lg font-semibold">GO BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Onboarding3')}>
            <Text className="text-lg font-semibold">SKIP</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-full">
            <Text className="font-semibold text-lg">Next</Text>
          </TouchableOpacity> */}
        </View>
      </LinearGradient>
    </View>
  );
}
