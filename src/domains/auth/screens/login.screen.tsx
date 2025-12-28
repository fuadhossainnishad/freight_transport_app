import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../navigation/type/Auth.type';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<Props>();

  // const handleLogin = () => {
  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [
  //         {
  //           name: 'HomeTab',
  //           state: {
  //             routes: [{ name: 'Home' }],
  //             index: 0,
  //           },
  //         },
  //       ],
  //     }),
  //   );
  // };

  return <Text>Login screen</Text>;
}

// const styles = StyleSheet.create({
//     space-y:{
//         space-y:8
//     }
// })
