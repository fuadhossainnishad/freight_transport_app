import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Alert
} from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"
import { Controller, useForm } from "react-hook-form"

import CustomInput from "../../../shared/components/CustomInput"
import CustomButton from "../../../shared/components/CustomButton"

import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { AuthParamList } from "../types"
import { useForgotPassword } from "../hooks/useForgotPassword"

type Props = NativeStackNavigationProp<AuthParamList, "ForgotPassword">

interface ForgotPasswordForm {
    email: string
}

export default function ForgetPasswordScreen() {

    const navigation = useNavigation<Props>()

    const { requestOtp, loading } = useForgotPassword()

    const { control, handleSubmit } = useForm<ForgotPasswordForm>()

    const onSubmit = async (data: ForgotPasswordForm) => {

        try {

            console.log("Forgot Password Email:", data.email)

            const res = await requestOtp(data.email)

            Alert.alert(
                "Success",
                "OTP sent to your email"
            )

            navigation.navigate("VerifyOtp", {
                email: data.email,
                verificationToken: res.verification_token
            })

        } catch (error: any) {

            Alert.alert(
                "Error",
                error?.message || "Failed to send OTP"
            )

        }

    }

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
                                    Forgot Password
                                </Text>

                                <Text className="text-gray-500 mt-2">
                                    Enter your email to receive OTP
                                </Text>
                            </View>

                            {/* EMAIL */}
                            <Text className="mb-2">Email Address</Text>

                            <Controller
                                control={control}
                                name="email"
                                rules={{ required: "Email is required" }}
                                render={({ field: { onChange, value } }) => (
                                    <CustomInput
                                        placeholder="Email address"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                            />

                            {/* SUBMIT */}
                            <CustomButton
                                title="Submit"
                                loading={loading}
                                onPress={handleSubmit(onSubmit)}
                            />

                            {/* BACK TO LOGIN */}
                            <CustomButton
                                title="Back To Login"
                                onPress={() => navigation.navigate("SignIn")}
                            />

                        </View>

                    </ScrollView>

                </TouchableWithoutFeedback>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}