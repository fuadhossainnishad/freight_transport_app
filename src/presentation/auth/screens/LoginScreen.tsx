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
import CustomButton from "../../../shared/components/CustomButton"

import { LoginForm } from "../../../domain/entities/LoginForm"
import { useLogin } from "../hooks/useLogin"

export default function LoginScreen() {
  const { login, loading } = useLogin()

  const { control, handleSubmit } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login(data.email, data.password)

      Alert.alert("Success", "Login successful")

      console.log("Role:", res.role)

      // navigate based on role here

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
            <View className="flex-1 px-6 pt-16">

              {/* HEADER */}
              <View className="mb-10">
                <Text className="text-3xl font-bold text-black">
                  Login to Account
                </Text>

                <Text className="text-gray-500 mt-2 text-base">
                  Please enter your email and password to continue
                </Text>
              </View>

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

              {/* PASSWORD */}
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
              <View className="flex-row justify-between items-center mt-2 mb-6">

                <TouchableOpacity>
                  <Text className="text-gray-500">
                    Remember Password
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text className="text-black font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

              </View>

              {/* LOGIN BUTTON */}
              <CustomButton
                title="Sign In"
                loading={loading}
                onPress={handleSubmit(onSubmit)}
              />

              {/* SIGNUP */}
              <View className="flex-row justify-center mt-8">
                <Text className="text-gray-500">
                  Don't have an account?
                </Text>

                <TouchableOpacity className="ml-2">
                  <Text className="font-semibold text-black">
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