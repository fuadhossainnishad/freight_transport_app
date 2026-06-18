import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import VehicleForm, { VehicleFormErrors } from "../components/VehicleForm";
import { addVehicle } from "../../../data/services/vehicleService";
import { VehicleFormValues } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VehicleStackParamList } from "../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../app/context/Auth.context";
import SuccessModal from "../../../shared/components/SuccessModal";

type props = NativeStackNavigationProp<VehicleStackParamList, "AddVehicle">;

const EMPTY_FORM: VehicleFormValues = {
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
};

// Derive a sensible filename + mime type from a local file uri.
const buildFilePart = (uri: string) => {
    const name = uri.split("/").pop() || `upload-${Date.now()}.jpg`;
    const ext = name.split(".").pop()?.toLowerCase();
    const type =
        ext === "png"
            ? "image/png"
            : ext === "webp"
                ? "image/webp"
                : ext === "pdf"
                    ? "application/pdf"
                    : "image/jpeg";
    return { uri, name, type };
};

const AddVehicleScreen = () => {
    const navigation = useNavigation<props>();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<VehicleFormErrors>({});
    const [form, setForm] = useState<VehicleFormValues>(EMPTY_FORM);

    const handleChange = (field: keyof VehicleFormValues, value: string | string[]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        // Clear the error for the field as the user fixes it.
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

    const validate = (): VehicleFormErrors => {
        const next: VehicleFormErrors = {};

        if (!form.vehicle_number.trim()) next.vehicle_number = "Vehicle number is required.";
        if (!form.plate_number.trim()) next.plate_number = "Plate number is required.";
        if (!form.vehicle_type.trim()) next.vehicle_type = "Please select a vehicle type.";
        if (!form.capicity.trim()) next.capicity = "Capacity is required.";
        if (!form.year_model.trim()) next.year_model = "Year model is required.";

        if (!form.plate_id?.length) next.plate_id = "Plate ID document is required.";
        if (!form.insurance?.length) next.insurance = "Insurance document is required.";
        if (!form.technical_visit?.length) next.technical_visit = "Technical visit document is required.";
        if (!form.vehicle_images?.length) next.vehicle_images = "Add at least one vehicle photo.";

        return next;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("transporter_id", user?.transporter_id!);

            // Text fields
            (["vehicle_number", "plate_number", "vehicle_type", "capicity", "year_model"] as const).forEach(
                (key) => formData.append(key, form[key] as string),
            );

            // File fields
            (["technical_visit", "insurance", "plate_id", "vehicle_images"] as const).forEach((key) => {
                (form[key] || []).forEach((uri) => {
                    formData.append(key, buildFilePart(uri) as any);
                });
            });

            await addVehicle(formData);
            setForm(EMPTY_FORM);
            setSuccess(true);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to add vehicle. Please try again.";
            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setSuccess(false);
        navigation.goBack();
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
            <AppHeader text="Add Vehicle" onpress={() => navigation.goBack()} />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
            >
                <VehicleForm
                    values={form}
                    errors={errors}
                    onCancel={() => navigation.goBack()}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            </KeyboardAvoidingView>

            <SuccessModal
                visible={success}
                title="Vehicle Added"
                message="Your vehicle has been added successfully and is now available for shipment bids."
                buttonText="Done"
                onClose={handleSuccessClose}
            />
        </SafeAreaView>
    );
};

export default AddVehicleScreen;
