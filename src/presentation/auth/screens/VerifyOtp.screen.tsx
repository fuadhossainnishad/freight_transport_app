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

import { useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RouteProp } from "@react-navigation/native"

import { AuthParamList } from "../types"
import { useVerifyOtp } from "../hooks/useVerifyOtp"

type NavigationProps = NativeStackNavigationProp<AuthParamList, "VerifyOtp">
type RouteProps = RouteProp<AuthParamList, "VerifyOtp">

interface OtpForm {
    otp: string
}

export default function VerifyOtpScreen() {

    const navigation = useNavigation<NavigationProps>()
    const route = useRoute<RouteProps>()

    const { email, verificationToken } = route.params

    const { verify, loading } = useVerifyOtp()

    const { control, handleSubmit } = useForm<OtpForm>()

    const onSubmit = async (data: OtpForm) => {

        try {

            const isVerified = await verify(email, data.otp)
            console.log("VerifyOtpScreen:", email, data.otp)

            if (!isVerified) {
                throw new Error("OTP verification failed")
            }

            Alert.alert(
                "Success",
                "OTP verified successfully"
            )

            navigation.navigate("ResetPassword", { verificationToken })

        } catch (error: any) {

            Alert.alert(
                "Verification Failed",
                error?.response?.data?.message ||
                error?.message ||
                "Invalid OTP"
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
                                    Verify OTP
                                </Text>

                                <Text className="text-gray-500 mt-2">
                                    Enter the OTP sent to your email
                                </Text>

                            </View>

                            {/* OTP INPUT */}
                            <Text className="mb-2">
                                OTP Code
                            </Text>

                            <Controller
                                control={control}
                                name="otp"
                                rules={{
                                    required: "OTP is required",
                                    minLength: {
                                        value: 4,
                                        message: "OTP must be 4 digits"
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <CustomInput
                                        placeholder="Enter OTP"
                                        keyboardType="number-pad"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                            />

                            {/* VERIFY BUTTON */}
                            <CustomButton
                                title="Verify OTP"
                                loading={loading}
                                onPress={handleSubmit(onSubmit)}
                            />

                            {/* BACK */}
                            <CustomButton
                                title="Back"
                                onPress={() => navigation.goBack()}
                            />

                        </View>

                    </ScrollView>

                </TouchableWithoutFeedback>

            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}