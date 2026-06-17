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
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";

import { CompanyRegistrationForm } from "../../../domain/entities/companyRegistrationForm";
import { TRUCK_TYPES } from "../../../domain/constants/truckTypes";
import {
  Country,
  DEFAULT_COUNTRY,
  isValidPhoneForCountry,
} from "../../../domain/constants/countries";
import { useSignup } from "../hooks/useSignup";
import CustomInput from "../../../shared/components/CustomInput";
import CountryPicker from "../../../shared/components/CountryPicker";
import PhoneNumberInput from "../../../shared/components/PhoneNumberInput";
import TruckTypeSelect from "../../../shared/components/TruckTypeSelect";
import PasswordInput from "../../../shared/components/PasswordInout";
import Checkbox from "../../../shared/components/Checkbox";
import RoleSelector from "../components/RoleSelector";
import { AuthParamList } from "../types";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../../../assets/icons/logo.svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Truck2 from "../../../../assets/icons/truck2.svg";
import Truck from "../../../../assets/icons/transporter.svg";
import Box2 from "../../../../assets/icons/box.svg";
import Box from "../../../../assets/icons/box2.svg";
import SubmitButton from "../../../shared/components/SubmitButton";

type props = NativeStackNavigationProp<AuthParamList, "RootAuth">;

// Readable field label (replaces the near-invisible text-black/10 labels).
const Label = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-sm font-semibold text-gray-700 mb-1.5">{children}</Text>
);

export default function SignupScreen() {
  const { signup, loading } = useSignup();
  const navigation = useNavigation<props>();

  // Selected country drives both the Country field and the phone prefix/flag.
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneError, setPhoneError] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<CompanyRegistrationForm>({
    defaultValues: {
      role: "SHIPPER",
      acceptTerms: false,
      service_policy: false,
    },
  });
  const selectedRole = watch("role");

  // When the country changes, trim any already-typed phone digits to the new
  // country's maximum so the field never holds more digits than allowed.
  const handleCountryChange = (next: Country) => {
    setCountry(next);
    setPhoneError(false);
    const maxDigits = Math.max(...next.phoneLengths);
    const current = (watch("phone") ?? "").replace(/\D/g, "");
    if (current.length > maxDigits) {
      setValue("phone", current.slice(0, maxDigits));
    }
  };

  const onSubmit = async (data: CompanyRegistrationForm) => {
    const nationalNumber = (data.phone ?? "").replace(/\D/g, "").replace(/^0+/, "");

    if (!isValidPhoneForCountry(country, nationalNumber)) {
      setPhoneError(true);
      Alert.alert(
        "Invalid phone number",
        `A ${country.name} phone number must be ${country.phoneLengths.join(" or ")} digits.`,
      );
      return;
    }
    setPhoneError(false);

    if ((data.password ?? "").length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (data.password !== data.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!data.acceptTerms) {
      Alert.alert("Error", "You must accept the general terms and conditions");
      return;
    }

    try {
      const fullPhone = `${country.dialCode}${nationalNumber}`;

      const response = await signup({
        ...data,
        phone: fullPhone,
        country: country.name,
      });

      if (response) {
        navigation.navigate("SignIn");
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
            <View className="border-b border-b-black/10 pb-6">
              <View className="flex-row justify-center">
                <Logo height={110} width={110} />
              </View>
              <View>
                <Text className="text-2xl text-center font-bold text-gray-900">
                  Create Account
                </Text>
                <Text className="text-gray-500 mt-1.5 text-sm text-center">
                  Join thousands of businesses and transporters
                </Text>
              </View>

              <View className="flex-row w-full flex-1 gap-3 mt-6">
                <RoleSelector
                  role="SHIPPER"
                  title="I'm a shipper"
                  theme="I need to ship goods"
                  selected={selectedRole === "SHIPPER"}
                  onRoleChange={(role) => setValue("role", role as "TRANSPORTER" | "SHIPPER")}
                  Icon={[Box, Box2]}
                />
                <RoleSelector
                  role="TRANSPORTER"
                  title="I'm a Transporter"
                  theme="I have trucks to offer"
                  selected={selectedRole === "TRANSPORTER"}
                  onRoleChange={(role) => setValue("role", role as "TRANSPORTER" | "SHIPPER")}
                  Icon={[Truck, Truck2]}
                />
              </View>
            </View>

            <View>
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Basic information
              </Text>

              {/* Company name */}
              <Label>Company name</Label>
              <Controller
                control={control}
                name="companyName"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Enter company name"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              {/* Email */}
              <Label>Email address</Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Your email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              {/* Phone — prefix/flag driven by selected country */}
              <Label>Phone number</Label>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <View style={{ marginBottom: 14 }}>
                    <PhoneNumberInput
                      country={country}
                      value={value ?? ""}
                      onChangeText={(t) => {
                        if (phoneError) setPhoneError(false);
                        onChange(t);
                      }}
                      onCountryChange={handleCountryChange}
                      error={phoneError}
                    />
                  </View>
                )}
              />

              {/* Country — selecting updates the phone prefix automatically */}
              <Label>Country</Label>
              <View style={{ marginBottom: 14 }}>
                <CountryPicker value={country} onChange={handleCountryChange} />
              </View>

              {selectedRole === "TRANSPORTER" && (
                <View>
                  {/* Number of Trucks */}
                  <Label>Number of trucks</Label>
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

                  {/* Truck Type */}
                  <Label>Truck type</Label>
                  <View style={{ marginBottom: 14 }}>
                    <Controller
                      control={control}
                      name="truckType"
                      render={({ field: { onChange, value } }) => (
                        <TruckTypeSelect
                          placeholder="Select truck type"
                          value={value}
                          data={TRUCK_TYPES}
                          onChange={onChange}
                        />
                      )}
                    />
                  </View>
                </View>
              )}

              {/* Password */}
              <Label>Password</Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View className="border border-gray-300 rounded-xl px-4 mb-3.5 h-[52px] justify-center">
                    <PasswordInput
                      placeholder="Minimum 6 characters"
                      value={value ?? ""}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />

              {/* Confirm Password */}
              <Label>Confirm Password</Label>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View className="border border-gray-300 rounded-xl px-4 mb-3.5 h-[52px] justify-center">
                    <PasswordInput
                      placeholder="Re-enter your password"
                      value={value ?? ""}
                      onChangeText={onChange}
                    />
                  </View>
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
            </View>

            <View style={styles.buttonWrapper}>
              <SubmitButton
                text="Create"
                loading={loading}
                onSubmit={handleSubmit(onSubmit)}
              />
            </View>

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 text-sm">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                <Text className="text-[#036BB4] font-semibold text-sm">Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    gap: 16,
  },

  // ── Checkboxes ──
  agreements: {
    marginTop: 12,
    gap: 14,
  },

  // ── Button ──
  buttonWrapper: {
    marginTop: 12,
  },
});
