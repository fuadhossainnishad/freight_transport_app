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
    <Text className="flex-1 text-center text-2xl font-medium text-black">
      Forgot Password?
    </Text>
  );
}
