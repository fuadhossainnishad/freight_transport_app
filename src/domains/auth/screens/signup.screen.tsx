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
  return (
    <Text className="flex-1 text-center text-2xl font-medium text-black">
      Forgot Password?
    </Text>
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
