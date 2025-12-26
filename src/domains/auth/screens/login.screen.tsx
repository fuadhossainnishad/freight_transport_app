import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { CommonActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'HomeTab',
            state: {
              routes: [{ name: 'Home' }],
              index: 0,
            },
          },
        ],
      }),
    );
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="items-center mb-8">
        <Image
          source={require('../../assets/images/logo.png')}
          className="w-24 h-24"
          resizeMode="contain"
        />
      </View>
      <View className="mb-8">
        <Text className="text-3xl font-bold text-center text-black">
          Welcome!
        </Text>
        <Text className=" text-center mt-2">
          Sign in to continue your account
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

        <View className="mb-4">
          <Text className=" mb-1">Password</Text>
          <View className="border border-gray-300 rounded-lg bg-white px-4 flex-row items-center">
            {/* TextInput */}
            <TextInput
              className="flex-1 py-3 text-black"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              placeholderTextColor="#62636C"
              value={password}
              onChangeText={setPassword}
            />

            {/* Eye Icon */}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#62636C"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setRemember(!remember)}
          >
            <View
              className={`w-5 h-5 rounded border ${remember ? 'bg-[#B09050] border-[#B09050]' : 'border-gray-400'
                }`}
            />
            <Text className="ml-2 ">Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}
          >
            <Text className="text-[#B09050] font-semibold">
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-[#B09050] py-4 rounded-full mb-6"
          onPress={handleLogin}
        >
          <Text className="text-center  font-normal text-lg">Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* OR Divider */}
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

      {/* Create Account */}
      <View className="flex-col items-center justify-center gap-5">
        <Text className="text-gray-500">Don’t have any account? </Text>
        <TouchableOpacity
          className="w-full "
          onPress={() => navigation.navigate('VerifyEmail')}
        >
          <Text className=" font-semibold text-center border-[1px] border-[#423526] p-4 w-full rounded-full">
            Create new account now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//     space-y:{
//         space-y:8
//     }
// })
