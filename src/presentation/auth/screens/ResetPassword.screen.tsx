import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    TouchableOpacity,
} from "react-native"
import { useEffect, useRef, useState } from "react"

import { SafeAreaView } from "react-native-safe-area-context"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native"

import CustomInput from "../../../shared/components/CustomInput"
import SubmitButton from "../../../shared/components/SubmitButton"
import { ShieldLockIllustration } from "../components/AuthIllustrations"

import { useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { AuthParamList } from "../types"
import { useResetPassword } from "../hooks/useResetPassword"

type Props = NativeStackNavigationProp<AuthParamList, "ResetPassword">

interface ResetPasswordForm {
    newPassword: string
    confirmPassword: string
}

export default function ResetPasswordScreen() {
    const { t } = useTranslation()
    const navigation = useNavigation<Props>()
    const route = useRoute()
    const isMounted = useRef(true)

    const { verificationToken } = route.params as { verificationToken: string }

    const { submitResetPassword, loading } = useResetPassword()

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        defaultValues: { newPassword: "", confirmPassword: "" },
    })

    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            await submitResetPassword(
                verificationToken,
                data.newPassword,
                data.confirmPassword,
            )

            if (!isMounted.current) return

            Alert.alert(t("common.success"), t("auth.resetPassword.successMessage"), [
                {
                    text: t("common.ok"),
                    onPress: () => {
                        if (isMounted.current) {
                            navigation.reset({ index: 0, routes: [{ name: "SignIn" }] })
                        }
                    },
                },
            ])
        } catch (error: any) {
            if (isMounted.current) {
                Alert.alert(t("auth.resetPassword.failedTitle"), error?.message || t("common.somethingWentWrong"))
            }
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
                            <ShieldLockIllustration size={176} />

                            {/* Header */}
                            <Text className="text-2xl font-bold text-center text-gray-900 mt-5">
                                {t("auth.resetPassword.title")}
                            </Text>
                            <Text className="text-gray-500 text-[15px] text-center mt-3 leading-6">
                                {t("auth.resetPassword.subtitle")}
                            </Text>

                            {/* New password */}
                            <View className="w-full mt-9">
                                <Text className="text-[#5C5C5C] mb-2">{t("auth.resetPassword.newPasswordLabel")}</Text>
                                <Controller
                                    control={control}
                                    name="newPassword"
                                    rules={{
                                        required: t("validation.newPasswordRequired"),
                                        minLength: {
                                            value: 6,
                                            message: t("validation.passwordMinLength", { min: 6 }),
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <View className="relative">
                                            <CustomInput
                                                placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
                                                secureTextEntry={!showNew}
                                                value={value}
                                                onChangeText={onChange}
                                                error={errors.newPassword?.message}
                                            />
                                            <TouchableOpacity
                                                className="absolute right-4 top-3.5"
                                                onPress={() => setShowNew((s) => !s)}
                                            >
                                                {showNew ? (
                                                    <EyeOff size={22} color="#000" />
                                                ) : (
                                                    <Eye size={22} color="#000" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                                {errors.newPassword ? (
                                    <Text className="text-red-500 text-xs -mt-2.5 mb-1">
                                        {errors.newPassword.message}
                                    </Text>
                                ) : null}

                                {/* Confirm password */}
                                <Text className="text-[#5C5C5C] mb-2 mt-3">{t("auth.resetPassword.confirmPasswordLabel")}</Text>
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    rules={{
                                        required: t("validation.confirmPasswordRequired"),
                                        validate: (v) =>
                                            v === watch("newPassword") || t("validation.passwordsDoNotMatch"),
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <View className="relative">
                                            <CustomInput
                                                placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
                                                secureTextEntry={!showConfirm}
                                                value={value}
                                                onChangeText={onChange}
                                                error={errors.confirmPassword?.message}
                                                returnKeyType="done"
                                                onSubmitEditing={handleSubmit(onSubmit)}
                                            />
                                            <TouchableOpacity
                                                className="absolute right-4 top-3.5"
                                                onPress={() => setShowConfirm((s) => !s)}
                                            >
                                                {showConfirm ? (
                                                    <EyeOff size={22} color="#000" />
                                                ) : (
                                                    <Eye size={22} color="#000" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                                {errors.confirmPassword ? (
                                    <Text className="text-red-500 text-xs -mt-2.5 mb-1">
                                        {errors.confirmPassword.message}
                                    </Text>
                                ) : null}
                            </View>
                        </View>

                        {/* Footer action — kept inside the scroll view so the
                            keyboard never hides it */}
                        <View className="px-7 pt-4 pb-4">
                            <SubmitButton text={t("auth.resetPassword.save")} loading={loading} onSubmit={handleSubmit(onSubmit)} />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
