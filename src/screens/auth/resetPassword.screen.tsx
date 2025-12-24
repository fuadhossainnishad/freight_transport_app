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
                            Unlock Your Account!                        </Text>
                        <Text className="text-base mt-2">
                            Set a strong password to unlock your account
                        </Text>
                    </View>

                    <View className="bg-[#B09050]/10 p-4 rounded-lg mb-6">
                        <View className="mb-4">
                            <Text className="mb-1">Password</Text>
                            <View className="border border-gray-300 rounded-lg bg-white px-4 flex-row items-center">
                                <TextInput
                                    className="flex-1 py-3 text-black"
                                    placeholder="Enter your password"
                                    secureTextEntry={!showPassword}
                                    placeholderTextColor="#62636C"
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Icon
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={22}
                                        color="#62636C"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View className="mb-4">
                            <Text className="mb-1">Confirm Password</Text>
                            <View className="border border-gray-300 rounded-lg bg-white px-4 flex-row items-center">
                                <TextInput
                                    className="flex-1 py-3 text-black"
                                    placeholder="Confirm your password"
                                    secureTextEntry={!showConfirmPassword}
                                    placeholderTextColor="#62636C"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Icon
                                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                                        size={22}
                                        color="#62636C"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-[#B09050] py-4 rounded-full mb-6"
                            onPress={() => {
                                navigation.navigate('Login');
                            }}
                        >
                            <Text className="text-center  font-normal text-lg">Update password</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </View>
        </View>
    );
}
