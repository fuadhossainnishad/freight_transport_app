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

  const { control, watch, setValue, handleSubmit, reset } =
    useForm<DriverFormValues>({
      defaultValues: {
        name: "",
        phone: "",
        email: "",
        idFront: [],
        idBack: [],
      },
    });

  // ✅ Fetch + populate
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setLoading(true);

        const res = await getDriverByIdsUseCase(driverId);

        reset({
          name: res.name,
          phone: res.phone,
          email: res.email,
          idFront: res.licenseFront ? [res.licenseFront] : [],
          idBack: res.licenseBack ? [res.licenseBack] : [],
        });

      } catch (err) {
        Alert.alert("Error", "Failed to load driver");
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [driverId, reset]);

  // ✅ UPDATE SUBMIT
  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);

      await UpdateDriverUseCase(driverId, data);

      Alert.alert("Success", "Driver updated successfully");

      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Update failed");
      console.error(err);
    } finally {
      setLoading(false);
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
      className="flex-1 bg-white p-4"
    >
      <AppHeader
        text="Edit Driver Details"
        onpress={() => navigation.goBack()}
      />

      <DriverForm
        control={control}
        watch={watch}
        setValue={setValue}
        onSubmit={onSubmit}
        isEdit
      />
    </SafeAreaView>
  );
}