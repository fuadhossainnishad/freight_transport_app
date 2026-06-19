// screens/driver/EditDriverScreen.tsx

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";

import DriverForm, {
  DriverFormValues,
} from "../components/DriverForm";

import { DriverStackParamList } from "../../../navigation/types";
import { getDriverByIdsUseCase, UpdateDriverUseCase } from "../../../domain/usecases/driver.usecase";

import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";
import {
  Country,
  DEFAULT_COUNTRY,
  isValidPhoneForCountry,
  splitInternationalPhone,
} from "../../../domain/constants/countries";

type Nav = NativeStackNavigationProp<
  DriverStackParamList,
  "UpdateDriverProfile"
>;

type RouteType = RouteProp<
  DriverStackParamList,
  "UpdateDriverProfile"
>;

export default function UpdateDriverScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation<Nav>();

  const { driverId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selected country drives both the Country field and the phone prefix/flag.
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneError, setPhoneError] = useState(false);

  const { control, watch, setValue, handleSubmit, reset } =
    useForm<DriverFormValues>({
      defaultValues: {
        name: "",
        phone: "",
        email: "",
        country: "",
        profilePicture: [],
        driverLicense: [],
      },
    });

  // ✅ Fetch + populate
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setLoading(true);

        const res = await getDriverByIdsUseCase(driverId);
        console.log("fetchDriverById:", res)

        // Restore the country + national number from the stored phone.
        const { country: parsedCountry, national } = splitInternationalPhone(
          res.phone,
          res.country
        );
        setCountry(parsedCountry);

        reset({
          name: res.name,
          phone: national,
          email: res.email,
          country: res.country ?? parsedCountry.name,
          profilePicture: res.avatar ? [res.avatar] : [],
          driverLicense: [res.licenseFront, res.licenseBack].filter(
            Boolean
          ) as string[],
        });

      } catch (err) {
        Alert.alert("Error", "Failed to load driver");
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [driverId, reset]);

  const handleCountryChange = (next: Country) => {
    setCountry(next);
    setPhoneError(false);
    const maxDigits = Math.max(...next.phoneLengths);
    const current = (watch("phone") ?? "").replace(/\D/g, "");
    if (current.length > maxDigits) {
      setValue("phone", current.slice(0, maxDigits));
    }
  };

  // ✅ UPDATE SUBMIT
  const onSubmit = handleSubmit(async (data) => {
    const national = (data.phone ?? "").replace(/\D/g, "").replace(/^0+/, "");

    if (!isValidPhoneForCountry(country, national)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    try {
      setSaving(true);

      await UpdateDriverUseCase(driverId, {
        ...data,
        phone: `${country.dialCode}${national}`,
        country: country.name,
      });

      Alert.alert("Success", "Driver updated successfully");

      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Update failed");
      console.error(err);
    } finally {
      setSaving(false);
    }
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-gray-50"
    >
      <AppHeader
        text="Edit Driver Details"
        onpress={() => navigation.goBack()}
      />

      <DriverForm
        control={control}
        watch={watch}
        setValue={setValue}
        country={country}
        onCountryChange={handleCountryChange}
        phoneError={phoneError}
        onSubmit={onSubmit}
        onCancel={() => navigation.goBack()}
        loading={saving}
        isEdit
      />
    </SafeAreaView>
  );
}
