import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"
import { Controller, useForm } from "react-hook-form"

import CustomInput from "../../../shared/components/CustomInput"

import Logo from "../../../../assets/icons/logo.svg"

import { LoginForm } from "../../../domain/entities/LoginForm"
import { useLogin } from "../hooks/useLogin"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AuthParamList } from "../types"
import { useNavigation } from "@react-navigation/native"
import SubmitButton from "../../../shared/components/SubmitButton"

type props = NativeStackNavigationProp<AuthParamList, 'SignIn'>;


export default function LoginScreen() {
  const { login, loading } = useLogin()
  const navigation = useNavigation<props>()


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
        "Login Failed",
        error?.response?.data?.message || "Something went wrong"
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
                  Login to Account
                </Text>

                <Text className="text-gray-500 mt-2 text-base m-4 text-center">
                  Please enter your email and password to continue
                </Text>
              </View>

              <Text className="text-[#5C5C5C]">Email address</Text>
              {/* EMAIL */}
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

              <Text className="text-[#5C5C5C]">Password</Text>
              <Controller
                control={control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              {/* REMEMBER + FORGOT */}
              <View className="flex-row justify-between items-center mb-6">

                <TouchableOpacity>
                  <Text className="text-[#5C5C5C]">
                    Remember Password
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}

                >
                  <Text className="text-[#036BB4] font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

              </View>

              {/* LOGIN BUTTON */}
              <SubmitButton
                text="Sign In"
                loading={loading}
                onSubmit={handleSubmit(onSubmit)}
              />

              {/* SIGNUP */}
              <View className="flex-row justify-center">
                <Text className="text-gray-500">
                  Don't have an account?
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate('RootAuth')}
                  className="ml-2">
                  <Text className="font-semibold text-[#036BB4]">
                    Sign Up
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