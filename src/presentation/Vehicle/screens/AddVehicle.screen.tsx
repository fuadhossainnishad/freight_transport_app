import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import VehicleForm from "../components/VehicleForm";
import { addVehicle } from "../../../data/services/vehicleService";
import { VehicleFormValues } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VehicleStackParamList } from "../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

type props = NativeStackNavigationProp<VehicleStackParamList, 'AddVehicle'>;
const AddVehicleScreen = () => {
    const navigation = useNavigation<props>();

    const [form, setForm] = useState<VehicleFormValues>({
        name: "",
        plateNumber: "",
        type: "",
        capacity: "",
        modelYear: "",
        registration: [],
        insurance: [],
        plateId: [],
        vehicleImages: [],
    });

    const handleChange = (field: keyof VehicleFormValues, value: string | string[]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            // Normal text fields
            ["name", "plateNumber", "type", "capacity", "modelYear"].forEach((key) => {
                const val = form[key as keyof VehicleFormValues];
                if (val) formData.append(key, val as string);
            });

            // File fields
            ["registration", "insurance", "plateId", "vehicleImages"].forEach((key) => {
                const files = form[key as keyof VehicleFormValues] as string[] | undefined;
                files?.forEach((file) => {
                    formData.append(key, {
                        uri: file,
                        name: file.split("/").pop(),
                        type: "image/jpeg",
                    } as any);
                });
            });

            const res = await addVehicle(formData);
            console.log("Vehicle added:", res);
            Alert.alert("Success", "Vehicle added successfully!");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add vehicle.");
        }
    };

    return (
        <SafeAreaView
            edges={['top']}
            className="flex-1  bg-white">

            <AppHeader text="Add Vehicle Details" onpress={() => navigation.goBack()} />
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}

            >

                <VehicleForm values={form} onChange={handleChange} onSubmit={handleSubmit} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddVehicleScreen;