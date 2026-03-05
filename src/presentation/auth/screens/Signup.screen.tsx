import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";


import { CompanyRegistrationForm } from "../../../domain/entities/CompanyRegistrationForm";
import { TRUCK_TYPES } from "../../../domain/constants/truckTypes";
import { useSignup } from "../hooks/useSignup";
import CustomInput from "../../../shared/components/CustomInput";
import Dropdown from "../../../shared/components/Dropdown";
import CustomButton from "../../../shared/components/CustomButton";

export default function SignupScreen() {
  const { signup, loading } = useSignup();

  const { control, handleSubmit, watch } = useForm<CompanyRegistrationForm>();

  const password = watch("password");

  const onSubmit = async (data: CompanyRegistrationForm) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!data.acceptTerms) {
      Alert.alert("Error", "You must accept the terms");
      return;
    }

    try {
      await signup(data);
      Alert.alert("Success", "Account created successfully");
    } catch (error: any) {
      Alert.alert("Signup Failed", error?.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.subtitle}>
              Join thousands of businesses and transporters
            </Text>

            <Controller
              control={control}
              name="companyName"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  placeholder="Company name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="ownerName"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  placeholder="Owner name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  placeholder="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  placeholder="Country"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="numberOfTrucks"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  placeholder="Number of trucks"
                  keyboardType="numeric"
                  value={value?.toString()}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="truckType"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  placeholder="Select truck type"
                  value={value}
                  data={TRUCK_TYPES}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  placeholder="Password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  placeholder="Confirm password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <View style={styles.buttonWrapper}>
              <CustomButton
                title="Create Account"
                loading={loading}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  flex: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    marginBottom: 24,
    color: "#666",
  },

  buttonWrapper: {
    marginTop: 20,
  },
});