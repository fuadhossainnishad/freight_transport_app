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
    <Text className="flex-1 text-center text-2xl font-medium text-black">
      Forgot Password?
    </Text>
  );
}
