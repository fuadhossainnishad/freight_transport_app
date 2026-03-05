import { useState } from "react";
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
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";

import { CompanyRegistrationForm } from "../../../domain/entities/CompanyRegistrationForm";
import { TRUCK_TYPES } from "../../../domain/constants/truckTypes";
import { useSignup } from "../hooks/useSignup";
import CustomInput from "../../../shared/components/CustomInput";
import Dropdown from "../../../shared/components/Dropdown";
import CustomButton from "../../../shared/components/CustomButton";
import PasswordInput from "../../../shared/components/PasswordInout";
import Checkbox from "../../../shared/components/Checkbox";
import RoleSelector from '../components/RoleSelector';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthParamList } from "../types";
import { useNavigation } from "@react-navigation/native";

type props = NativeStackNavigationProp<AuthParamList, 'RootAuth'>;

export default function SignupScreen() {
  const { signup, loading } = useSignup();
  const navigation = useNavigation<props>()

  // CountryCodeDropdownPicker manages its own dial-code state
  const [dialCode, setDialCode] = useState<string>("+880");
  const [countryDetails, setCountryDetails] = useState<any>(null);
  const { control, handleSubmit, setValue, watch } = useForm<CompanyRegistrationForm>({
    defaultValues: {
      role: "TRANSPORTER",
      acceptTerms: false,
      service_policy: false,
    },
  });
  const selectedRole = watch("role");

  const onSubmit = async (data: CompanyRegistrationForm) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!data.acceptTerms) {
      Alert.alert("Error", "You must accept the general terms and conditions");
      return;
    }


    try {
      const normalizedPhone = data.phone.replace(/^0+/, "");

      // Merge dial code with phone
      const fullPhone = `${dialCode}${normalizedPhone}`;

      const response = await signup({
        ...data,
        phone: fullPhone,
        country: countryDetails?.name ?? "",
      });

      if (response) {
        navigation.navigate('SignIn')
      }
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
            <View className="flex-row w-full flex-1 ">
              <RoleSelector
                role="SHIPPER"
                title='I need to ship goods'
                selected={selectedRole === "SHIPPER"}
                onRoleChange={(role) => setValue("role", role as "TRANSPORTER" | "SHIPPER")}
              />
              <RoleSelector
                role="TRANSPORTER"
                title='I have trucks to offer'
                selected={selectedRole === "TRANSPORTER"}
                onRoleChange={(role) => setValue("role", role as "TRANSPORTER" | "SHIPPER")}
              />

            </View>
            {/* Company Name */}
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

            {/* Email */}
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

            {/* Phone */}
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

            {/*
              Country picker — flag + dial code dropdown
              react-native-dropdown-country-picker:
              - zero dependencies, React 19 compatible
              - shows flag emoji + calling code
              - built-in search
            */}
            <View style={styles.countryPickerWrapper}>
              <Text style={styles.countryPickerLabel}>Country</Text>
              <CountryCodeDropdownPicker
                selected={dialCode}
                setSelected={setDialCode as any}
                setCountryDetails={setCountryDetails}
                countryCodeContainerStyles={styles.countryCodeContainer}
                countryCodeTextStyles={styles.countryCodeText}
              />
            </View>

            {selectedRole === 'TRANSPORTER' &&
              <View>
                {/* Number of Trucks */}
                < Controller
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

                {/* Truck Type */}
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
              </View>

            }
            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <PasswordInput
                  placeholder="Password"
                  value={value ?? ""}
                  onChangeText={onChange}
                />
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <PasswordInput
                  placeholder="Confirm password"
                  value={value ?? ""}
                  onChangeText={onChange}
                />
              )}
            />

            {/* Agreement Checkboxes */}
            <View style={styles.agreements}>
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={!!value}
                    onToggle={() => onChange(!value)}
                    label="I have read and I accept the general terms and conditions"
                  />
                )}
              />

              <Controller
                control={control}
                name="service_policy"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={!!value}
                    onToggle={() => onChange(!value)}
                    label="I understood that Lawapan Truck is a service dedicated to professionals"
                  />
                )}
              />
            </View>

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
    </SafeAreaView >
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

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
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    color: "#666",
  },

  // ── Country Picker ──
  countryPickerWrapper: {
    marginBottom: 12,
  },
  countryPickerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    marginBottom: 4,
    marginLeft: 2,
  },
  countryCodeContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    paddingHorizontal: 14,
    paddingVertical: 4,
    minHeight: 50,
  },
  countryCodeText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  // ── Password ──
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: "#111",
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIconWrapper: {
    width: 22,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeOval: {
    width: 20,
    height: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#888",
    position: "absolute",
  },
  eyePupil: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#888",
    position: "absolute",
  },
  eyeSlash: {
    position: "absolute",
    width: 26,
    height: 2,
    backgroundColor: "#888",
    transform: [{ rotate: "-45deg" }],
  },

  // ── Checkboxes ──
  agreements: {
    marginTop: 12,
    gap: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    borderColor: "#2563eb",
    backgroundColor: "#2563eb",
  },
  checkboxTick: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 14,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: "#444",
    lineHeight: 20,
  },

  // ── Button ──
  buttonWrapper: {
    marginTop: 24,
  },
});