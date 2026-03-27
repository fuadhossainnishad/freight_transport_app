// screens/driver/AddDriverScreen.tsx

import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

import DriverForm from "../components/DriverForm";
import AppHeader from "../../../shared/components/AppHeader";
import { DriverEntity } from "../types";
import { CreateDriverUseCase } from "../../../domain/usecases/driver.usecase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../app/context/Auth.context";


export default function AddDriverScreen() {
  const navigation = useNavigation();
  const { user } = useAuth()


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

      await CreateDriverUseCase(data);

      console.log("Driver Created Successfully");

      navigation.goBack();
    } catch (error) {
      console.log("Error creating driver:", error);
    }
  });

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white p-4">

      <AppHeader
        text="Add Driver"
        onpress={() => navigation.goBack()}
      />

      <DriverForm
        control={control}
        watch={watch}
        setValue={setValue}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  );
}