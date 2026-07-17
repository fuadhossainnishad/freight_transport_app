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
import { useEffect, useState } from "react"

import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next"
import { ArrowLeft } from "lucide-react-native"

import OtpInput from "../../../shared/components/OtpInput"
import SubmitButton from "../../../shared/components/SubmitButton"
import { MailVerifyIllustration } from "../components/AuthIllustrations"

import { useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RouteProp } from "@react-navigation/native"

import { AuthParamList } from "../types"
import { useVerifyOtp } from "../hooks/useVerifyOtp"
import { useForgotPassword } from "../hooks/useForgotPassword"

type NavigationProps = NativeStackNavigationProp<AuthParamList, "VerifyOtp">
type RouteProps = RouteProp<AuthParamList, "VerifyOtp">

const OTP_LENGTH = 6
const RESEND_SECONDS = 60

export default function VerifyOtpScreen() {
    const { t } = useTranslation()
    const navigation = useNavigation<NavigationProps>()
    const route = useRoute<RouteProps>()

    const { email, verificationToken: initialToken } = route.params

    const { verify, loading } = useVerifyOtp()
    const { requestOtp, loading: resending } = useForgotPassword()

    const [otp, setOtp] = useState("")
    const [error, setError] = useState(false)
    const [token, setToken] = useState(initialToken)
    const [cooldown, setCooldown] = useState(RESEND_SECONDS)

    // Resend countdown.
    useEffect(() => {
        if (cooldown <= 0) return
        const timer = setTimeout(() => setCooldown((s) => s - 1), 1000)
        return () => clearTimeout(timer)
    }, [cooldown])

    const onChangeOtp = (code: string) => {
        if (error) setError(false)
        setOtp(code)
    }

    const onVerify = async () => {
        if (otp.length < OTP_LENGTH) {
            setError(true)
            return
        }

        try {
            const isVerified = await verify(email, otp)
            if (!isVerified) throw new Error(t("auth.verifyOtp.verificationFailed"))

            navigation.navigate("ResetPassword", { verificationToken: token })
        } catch (err: any) {
            setError(true)
            Alert.alert(
                t("auth.verifyOtp.failedTitle"),
                err?.response?.data?.message || err?.message || t("auth.verifyOtp.invalidOtp"),
            )
        }
    }

    const onResend = async () => {
        if (cooldown > 0 || resending) return
        try {
            const res = await requestOtp(email)
            setToken(res.verification_token)
            setOtp("")
            setError(false)
            setCooldown(RESEND_SECONDS)
            Alert.alert(
                t("auth.verifyOtp.codeSentTitle"),
                t("auth.verifyOtp.codeSentMessage", { email }),
            )
        } catch (err: any) {
            Alert.alert(t("common.error"), err?.message || t("auth.verifyOtp.resendFailed"))
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
                            <MailVerifyIllustration size={176} />

                            {/* Header */}
                            <Text className="text-2xl font-bold text-center text-gray-900 mt-5">
                                {t("auth.verifyOtp.title")}
                            </Text>
                            <Text className="text-gray-500 text-[15px] text-center mt-3 leading-6">
                                {t("auth.verifyOtp.subtitle", { length: OTP_LENGTH })}{"\n"}
                                <Text className="text-gray-800 font-semibold">{email}</Text>
                            </Text>

                            {/* OTP boxes */}
                            <View className="w-full mt-9">
                                <OtpInput
                                    value={otp}
                                    onChange={onChangeOtp}
                                    length={OTP_LENGTH}
                                    error={error}
                                />
                            </View>

                            {/* Resend */}
                            <View className="flex-row justify-center mt-7">
                                <Text className="text-gray-500">{t("auth.verifyOtp.noCode")}</Text>
                                {cooldown > 0 ? (
                                    <Text className="text-gray-400 font-medium">
                                        {t("auth.verifyOtp.resendIn", { seconds: cooldown })}
                                    </Text>
                                ) : (
                                    <TouchableOpacity
                                        onPress={onResend}
                                        activeOpacity={0.7}
                                        disabled={resending}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Text className="font-semibold text-[#036BB4]">
                                            {resending ? t("common.sending") : t("auth.verifyOtp.resendCode")}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Footer action — kept inside the scroll view so the
                            keyboard never hides it */}
                        <View className="px-7 pt-4 pb-4">
                            <SubmitButton text={t("auth.verifyOtp.verify")} loading={loading} onSubmit={onVerify} />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
