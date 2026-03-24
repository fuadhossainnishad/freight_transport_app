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
import { useAuth } from "../../../app/context/Auth.context";

type props = NativeStackNavigationProp<VehicleStackParamList, 'AddVehicle'>;
const AddVehicleScreen = () => {
    const navigation = useNavigation<props>();
    const { user } = useAuth()
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<VehicleFormValues>({
        transporter_id: "",
        vehicle_number: "",
        plate_number: "",
        vehicle_type: "",
        capicity: "",
        year_model: "",
        technical_visit: [],
        insurance: [],
        plate_id: [],
        vehicle_images: [],
    });

    const handleChange = (field: keyof VehicleFormValues, value: string | string[]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.vehicle_number || !form.plate_number || !form.vehicle_type) {
            Alert.alert("Validation Error", "Please fill all required fields.");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("transporter_id", user?.transporter_id!);

            // Normal text fields
            ["vehicle_number", "plate_number", "vehicle_type", "capicity", "year_model"].forEach((key) => {
                const val = form[key as keyof VehicleFormValues];
                if (val) formData.append(key, val as string);
            });

            // File fields
            ["technical_visit", "insurance", "plate_id", "vehicle_images"].forEach((key) => {
                const files = form[key as keyof VehicleFormValues] as string[] | undefined;
                files?.forEach((file) => {
                    formData.append(key, {
                        uri: file,
                        name: file.split("/").pop(),
                        type: "image/jpeg",
                    } as any);
                });
            });
            console.log("Vehicle formData:", formData);

            const res = await addVehicle(formData);
            console.log("Vehicle added:", res);
            Alert.alert("Success", "Vehicle added successfully!");
            setForm({
                transporter_id: form.transporter_id,
                vehicle_number: "",
                plate_number: "",
                vehicle_type: "",
                capicity: "",
                year_model: "",
                technical_visit: [],
                insurance: [],
                plate_id: [],
                vehicle_images: [],
            });

            // Optionally navigate back to vehicle list
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add vehicle.");
        } finally {
            setLoading(false); // stop loader
        }
    };

    return (
        <SafeAreaView
            edges={['top']}
            className="flex-1 bg-white">

            <AppHeader text="Add Vehicle Details" onpress={() => navigation.goBack()} />
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}

            >

                <VehicleForm
                    values={form}
                    onCancel={() => navigation.goBack()}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddVehicleScreen;