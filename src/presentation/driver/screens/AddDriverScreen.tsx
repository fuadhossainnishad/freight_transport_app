import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

import DriverForm from "../components/DriverForm";
import AppHeader from "../../../shared/components/AppHeader";
import { DriverEntity } from "../types";
import { CreateDriverUseCase } from "../../../domain/usecases/driver.usecase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../app/context/Auth.context";

export default function AddDriverScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const { control, watch, setValue, handleSubmit } =
    useForm<DriverEntity>({
      defaultValues: {
        transporter_id: user?.transporter_id!,
        name: "",
        phone: "",
        email: "",
        idFront: [],
        idBack: [],
      },
    });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);

      await CreateDriverUseCase(data);

      Alert.alert("Success", "Driver created successfully");

      navigation.goBack();
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
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <AppHeader
        text="Add Driver"
        onpress={() => navigation.goBack()}
      />

      <DriverForm
        control={control}
        watch={watch}
        setValue={setValue}
        onSubmit={onSubmit}
        loading={loading}   // ✅ pass loading
      />
    </SafeAreaView>
  );
}