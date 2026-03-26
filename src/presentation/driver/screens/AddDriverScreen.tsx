// screens/driver/AddDriverScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DriverForm from "../components/DriverForm";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DriverStackParamList } from "../../../navigation/types";

type Props = NativeStackNavigationProp<DriverStackParamList, 'AddDriver'>;


export default function AddDriverScreen() {
  const navigation = useNavigation<Props>();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleSave = () => {
    // validation + API call
  };

  return (
    <View className="flex-1 bg-white p-4">

      <Text className="text-xl font-bold mb-4">Add Vehicle Details</Text>

      <DriverForm form={form} setForm={setForm} />

      <TouchableOpacity
        onPress={handleSave}
        className="bg-black p-4 rounded-xl mt-4"
      >
        <Text className="text-white text-center">Save</Text>
      </TouchableOpacity>

    </View>
  );
}