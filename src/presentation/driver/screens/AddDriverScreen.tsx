import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";

import DriverForm, { DriverFormValues } from "../components/DriverForm";
import AppHeader from "../../../shared/components/AppHeader";
import SuccessModal from "../../../shared/components/SuccessModal";
import { CreateDriverUseCase } from "../../../domain/usecases/driver.usecase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../app/context/Auth.context";
import {
  Country,
  DEFAULT_COUNTRY,
  isValidPhoneForCountry,
} from "../../../domain/constants/countries";

export default function AddDriverScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Selected country drives both the Country field and the phone prefix/flag.
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneError, setPhoneError] = useState(false);

  const { control, watch, setValue, handleSubmit } = useForm<DriverFormValues>({
    defaultValues: {
      transporter_id: user?.transporter_id!,
      name: "",
      phone: "",
      email: "",
      country: "",
      profilePicture: [],
      driverLicense: [],
    },
  });

  // Switching country trims any already-typed digits to the new country's max.
  const handleCountryChange = (next: Country) => {
    setCountry(next);
    setPhoneError(false);
    const maxDigits = Math.max(...next.phoneLengths);
    const current = (watch("phone") ?? "").replace(/\D/g, "");
    if (current.length > maxDigits) {
      setValue("phone", current.slice(0, maxDigits));
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const national = (data.phone ?? "").replace(/\D/g, "").replace(/^0+/, "");

    if (!isValidPhoneForCountry(country, national)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    try {
      setLoading(true);

      await CreateDriverUseCase({
        ...data,
        phone: `${country.dialCode}${national}`,
        country: country.name,
      });

      setSuccess(true);
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create driver"
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <AppHeader text="Add Driver" onpress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <DriverForm
          control={control}
          watch={watch}
          setValue={setValue}
          country={country}
          onCountryChange={handleCountryChange}
          phoneError={phoneError}
          onSubmit={onSubmit}
          onCancel={() => navigation.goBack()}
          loading={loading}
        />
      </KeyboardAvoidingView>

      <SuccessModal
        visible={success}
        title="Driver Added"
        message="The driver has been added successfully and can now be assigned to shipments."
        buttonText="Done"
        onClose={() => {
          setSuccess(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
