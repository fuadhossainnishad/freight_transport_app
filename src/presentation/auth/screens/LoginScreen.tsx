import {
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
  Alert,
} from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import CustomInput from "../../../shared/components/CustomInput"

import Logo from "../../../../assets/icons/logo.svg"
import { Eye, EyeOff } from 'lucide-react-native';

import { LoginForm } from "../../../domain/entities/LoginForm"
import { useLogin } from "../hooks/useLogin"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AuthParamList } from "../types"
import { useNavigation } from "@react-navigation/native"
import SubmitButton from "../../../shared/components/SubmitButton"
import { useState } from "react"

type props = NativeStackNavigationProp<AuthParamList, 'SignIn'>;


export default function LoginScreen() {
  const { t } = useTranslation()
  const { login, loading } = useLogin()
  const navigation = useNavigation<props>()
  const [showPassword, setShowPassword] = useState<boolean>(false)


  const { control, handleSubmit } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log("logindata:", data)

      await login(data.email, data.password)

      // if (res.role === "TRANSPORTER") {

      //   const profile = await getTransporterProfile(res.id)

      //   const isComplete = isTransporterProfileComplete(profile)

      //   if (!isComplete) {
      //     navigation.navigate("CompleteTransporterProfile")
      //     return
      //   }

      //   navigation.navigate("TransporterDashboard")
      // }

      // if (res.role === "SHIPPER") {

      //   const profile = await getShipperProfile(res.userId)

      //   if (!profile) {
      //     navigation.navigate("CompleteShipperProfile")
      //     return
      //   }

      //   navigation.navigate("ShipperDashboard")
      // }

    } catch (error: any) {

      Alert.alert(
        t("auth.login.failedTitle"),
        error?.response?.data?.message || t("common.somethingWentWrong")
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
            <View className="flex-1 px-6 gap-1">
              <View className="flex-row justify-center">
                <Logo height={120} width={120} />
              </View>

              {/* HEADER */}
              <View className="">
                <Text className="text-3xl text-center font-bold text-[#036BB4]">
                  {t("auth.login.title")}
                </Text>

                <Text className="text-gray-500 mt-2 text-base m-4 text-center">
                  {t("auth.login.subtitle")}
                </Text>
              </View>

              <Text className="text-[#5C5C5C]">{t("auth.login.emailLabel")}</Text>

              {/* EMAIL */}
              <Controller
                control={control}
                name="email"
                rules={{ required: t("validation.emailRequired") }}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder={t("auth.login.emailPlaceholder")}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <Text className="text-[#5C5C5C]">{t("auth.login.passwordLabel")}</Text>
              <Controller
                control={control}
                name="password"
                rules={{ required: t("validation.passwordRequired") }}
                render={({ field: { onChange, value } }) => (
                  <View className="relative">
                    <CustomInput
                      placeholder={t("auth.login.passwordPlaceholder")}
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-4"
                      onPress={() => setShowPassword(!showPassword)}>
                      {
                        showPassword ?
                          <EyeOff size={22} color={'#000000'} />
                          :
                          <Eye size={22} color={'#000000'} />
                      }
                    </TouchableOpacity>
                  </View>

                )}
              />

              {/* REMEMBER + FORGOT */}
              <View className="flex-row justify-between items-center mb-6">

                <TouchableOpacity>
                  <Text className="text-[#5C5C5C]">
                    {t("auth.login.rememberPassword")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}

                >
                  <Text className="text-[#036BB4] font-medium">
                    {t("auth.login.forgotPassword")}
                  </Text>
                </TouchableOpacity>

              </View>

              {/* LOGIN BUTTON */}
              <SubmitButton
                text={t("auth.login.signIn")}
                loading={loading}
                onSubmit={handleSubmit(onSubmit)}
              />

              {/* SIGNUP */}
              <View className="flex-row justify-center">
                <Text className="text-gray-500">
                  {t("auth.login.noAccount")}
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate('RootAuth')}
                  className="ml-2">
                  <Text className="font-semibold text-[#036BB4]">
                    {t("auth.login.signUp")}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}