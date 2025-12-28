import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For the back arrow
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ResetPasswordScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'ResetPassword'
>;

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation<ResetPasswordScreenProp>();

  return (
    <Text className="flex-1 text-center text-2xl font-medium text-black">
      Forgot Password?
    </Text>
  );
}
