import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VehicleStackParamList } from "../../../navigation/types";
import { getVehicleById, updateVehicle } from "../../../data/services/vehicleService";
import AppHeader from "../../../shared/components/AppHeader";
import VehicleForm, { VehicleFormErrors } from "../components/VehicleForm";
import { VehicleFormValues } from "../types";
import SuccessModal from "../../../shared/components/SuccessModal";

type props = NativeStackNavigationProp<VehicleStackParamList, "UpdateVehicle">;
type RoutePropType = RouteProp<VehicleStackParamList, "UpdateVehicle">;

const PRIMARY = "#036BB4";

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

const isLocalFile = (uri: string) => uri.startsWith("file://") || uri.startsWith("content://");

// Derive a sensible filename + mime type from a local file uri.
const buildFilePart = (uri: string) => {
    const name = uri.split("/").pop() || `upload-${Date.now()}.jpg`;
    const ext = name.split(".").pop()?.toLowerCase();
    const type =
        ext === "png" ? "image/png"
            : ext === "webp" ? "image/webp"
                : ext === "pdf" ? "application/pdf"
                    : "image/jpeg";
    return { uri, name, type };
};

const UpdateVehicleScreen = () => {
    const navigation = useNavigation<props>();
    const route = useRoute<RoutePropType>();
    const { vehicleId } = route.params;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<VehicleFormErrors>({});
    const [form, setForm] = useState<VehicleFormValues>(EMPTY_FORM);

    useEffect(() => {
        fetchVehicle();
    }, []);

    const fetchVehicle = async () => {
        try {
            setLoading(true);
            const vehicle = await getVehicleById(vehicleId);

            const docsByType = (type: string) =>
                vehicle.documents.filter((d) => d.type === type).map((d) => d.url);

            setForm({
                transporter_id: "",
                vehicle_number: vehicle.name || "", // ← real vehicle number, not the Mongo _id
                plate_number: vehicle.plateNumber || "",
                vehicle_type: vehicle.type || "",
                // Strip any unit so the numeric field shows a clean value ("20 Tons" → "20").
                capicity: (vehicle.capacity || "").replace(/[^\d.]/g, ""),
                year_model: vehicle.modelYear || "",
                plate_id: docsByType("plateId"),
                insurance: docsByType("insurance"),
                technical_visit: docsByType("technicalVisit"),
                vehicle_images: vehicle.images || [],
            });
        } catch (err) {
            Alert.alert("Error", "Failed to load vehicle data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof VehicleFormValues, value: string | string[]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
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
            setSaving(true);
            const formData = new FormData();

            (["vehicle_number", "plate_number", "vehicle_type", "capicity", "year_model"] as const).forEach(
                (key) => formData.append(key, form[key] as string),
            );

            // Only send newly-picked local files. Untouched remote URLs are left
            // alone — the backend keeps the existing files for those fields.
            (["technical_visit", "insurance", "plate_id", "vehicle_images"] as const).forEach((key) => {
                (form[key] || []).filter(isLocalFile).forEach((uri) => {
                    formData.append(key, buildFilePart(uri) as any);
                });
            });

            await updateVehicle(vehicleId, formData);
            setSuccess(true);
        } catch (err: any) {
            const message =
                err?.response?.data?.message || err?.message || "Failed to update vehicle.";
            Alert.alert("Error", message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color={PRIMARY} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
            <AppHeader text="Edit Vehicle" onpress={() => navigation.goBack()} />

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
                    loading={saving}
                    submitLabel="Save Changes"
                    submittingLabel="Saving..."
                />
            </KeyboardAvoidingView>

            <SuccessModal
                visible={success}
                title="Changes Saved"
                message="The vehicle details have been updated successfully."
                buttonText="Done"
                onClose={() => {
                    setSuccess(false);
                    navigation.goBack();
                }}
            />
        </SafeAreaView>
    );
};

export default UpdateVehicleScreen;
