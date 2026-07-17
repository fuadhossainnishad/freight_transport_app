import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ArrowLeft } from "lucide-react-native"

import CustomInput from "../../../shared/components/CustomInput"
import SubmitButton from "../../../shared/components/SubmitButton"
import { LockIllustration } from "../components/AuthIllustrations"

import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { AuthParamList } from "../types"
import { useForgotPassword } from "../hooks/useForgotPassword"

type Props = NativeStackNavigationProp<AuthParamList, "ForgotPassword">

interface ForgotPasswordForm {
    email: string
}

export default function ForgetPasswordScreen() {
    const { t } = useTranslation()
    const navigation = useNavigation<Props>()

    const { requestOtp, loading } = useForgotPassword()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({ defaultValues: { email: "" } })

    const onSubmit = async (data: ForgotPasswordForm) => {
        const email = data.email.trim().toLowerCase()

        try {
            const res = await requestOtp(email)

            navigation.navigate("VerifyOtp", {
                email,
                verificationToken: res.verification_token,
            })
        } catch (error: any) {
            Alert.alert(t("common.error"), error?.message || t("auth.forgotPassword.otpFailed"))
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Back button */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                            className="mt-2 ml-4 w-11 h-11 rounded-full items-center justify-center bg-gray-50 border border-gray-100"
                        >
                            <ArrowLeft size={22} color="#111" />
                        </TouchableOpacity>

                        <View className="flex-1 px-7 pt-6 items-center">
                            {/* Illustration */}
                            <LockIllustration size={176} />

                            {/* Header */}
                            <Text className="text-2xl font-bold text-center text-gray-900 mt-5">
                                {t("auth.forgotPassword.title")}
                            </Text>
                            <Text className="text-gray-500 text-[15px] text-center mt-3 leading-6">
                                {t("auth.forgotPassword.subtitle")}
                            </Text>

                            {/* Email */}
                            <View className="w-full mt-9">
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: t("validation.emailRequired"),
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: t("validation.emailInvalid"),
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <CustomInput
                                            placeholder={t("auth.forgotPassword.emailPlaceholder")}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            autoCorrect={false}
                                            value={value}
                                            onChangeText={onChange}
                                            error={errors.email?.message}
                                            returnKeyType="send"
                                            onSubmitEditing={handleSubmit(onSubmit)}
                                        />
                                    )}
                                />

                                {errors.email ? (
                                    <Text className="text-red-500 text-xs -mt-2.5 mb-1">
                                        {errors.email.message}
                                    </Text>
                                ) : null}
                            </View>
                        </View>

                        {/* Footer action — kept inside the scroll view so the
                            keyboard never hides it */}
                        <View className="px-7 pt-4 pb-4">
                            <SubmitButton
                                text={t("auth.forgotPassword.send")}
                                loading={loading}
                                onSubmit={handleSubmit(onSubmit)}
                            />

                            <View className="flex-row justify-center mt-5">
                                <Text className="text-gray-500">{t("auth.forgotPassword.rememberPassword")}</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("SignIn")}
                                    className="ml-2"
                                    activeOpacity={0.7}
                                >
                                    <Text className="font-semibold text-[#036BB4]">{t("auth.forgotPassword.logIn")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
