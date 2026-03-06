import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"
import { Controller, useForm } from "react-hook-form"

import CustomInput from "../../../shared/components/CustomInput"
import CustomButton from "../../../shared/components/CustomButton"

import { useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { AuthParamList } from "../types"
import { useResetPassword } from "../hooks/useResetPassword"
import { useEffect, useRef } from "react"

type Props = NativeStackNavigationProp<AuthParamList, "ResetPassword">

interface ResetPasswordForm {
    newPassword: string
    confirmPassword: string
}

export default function ResetPasswordScreen() {

    const navigation = useNavigation<Props>()
    const route = useRoute()
    const isMounted = useRef(true)


    const { verificationToken } = route.params as {
        verificationToken: string
    }

    const { submitResetPassword, loading } = useResetPassword()

    const { control, handleSubmit } = useForm<ResetPasswordForm>()

    const onSubmit = async (data: ResetPasswordForm) => {

        if (data.newPassword !== data.confirmPassword) {
            Alert.alert("Error", "Passwords do not match")
            return
        }

        try {

            await submitResetPassword(
                verificationToken,
                data.newPassword,
                data.confirmPassword
            )

            if (isMounted.current) {

                Alert.alert(
                    "Success",
                    "Password reset successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                if (isMounted.current) {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: "SignIn" }]
                                    })
                                }
                            }
                        }
                    ]
                )

            }

        } catch (error: any) {

            if (isMounted.current) {
                Alert.alert(
                    "Reset Failed",
                    error?.message || "Something went wrong"
                )
            }

        }
    }


    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-white">

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >

                        <View className="flex-1 px-6 pt-16">

                            {/* HEADER */}
                            <View className="mb-10">
                                <Text className="text-3xl font-bold text-black">
                                    Reset Password
                                </Text>

                                <Text className="text-gray-500 mt-2">
                                    Enter your new password
                                </Text>
                            </View>

                            {/* NEW PASSWORD */}
                            <Text className="mb-2">New Password</Text>

                            <Controller
                                control={control}
                                name="newPassword"
                                rules={{ required: "New password is required" }}
                                render={({ field: { onChange, value } }) => (
                                    <CustomInput
                                        placeholder="New Password"
                                        secureTextEntry
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                            />

                            {/* CONFIRM PASSWORD */}
                            <Text className="mt-4 mb-2">Confirm Password</Text>

                            <Controller
                                control={control}
                                name="confirmPassword"
                                rules={{ required: "Confirm password is required" }}
                                render={({ field: { onChange, value } }) => (
                                    <CustomInput
                                        placeholder="Confirm Password"
                                        secureTextEntry
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                            />

                            {/* SUBMIT BUTTON */}
                            <CustomButton
                                title="Reset Password"
                                loading={loading}
                                onPress={handleSubmit(onSubmit)}
                            />

                        </View>

                    </ScrollView>

                </TouchableWithoutFeedback>

            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}