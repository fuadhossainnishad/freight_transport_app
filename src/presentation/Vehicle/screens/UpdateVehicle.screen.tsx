import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    TextInput,
    Modal,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { VehicleStackParamList } from "../../../navigation/types";
import { getVehicleById, updateVehicle } from "../../../data/services/vehicleService";
import AppHeader from "../../../shared/components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectField2 from "../../../shared/components/SelectField2";
import EditIcon from "../../../../assets/icons/edit3.svg"
import { DocPicker } from "../../../shared/components/DocPicker";

const VEHICLE_TYPES = ["Truck", "Trailer", "Closed Truck", "Van"]; // Example types

type props = NativeStackNavigationProp<VehicleStackParamList, "UpdateVehicle">;
type RoutePropType = RouteProp<VehicleStackParamList, "UpdateVehicle">;

interface FormValues {
    plate_number: string;
    vehicle_type: string;
    capicity: string;
    year_model: string;
    plate_id: any[];
    insurance: any[];
    technical_visit: any[];
    vehicle_images: any[];
    vehicle_number: string;
}

const fileFields: { label: string; name: keyof FormValues }[] = [
    { label: "Plate ID", name: "plate_id" },
    { label: "Insurance", name: "insurance" },
    { label: "Technical Visit", name: "technical_visit" },
    { label: "Vehicle Images", name: "vehicle_images" },
];

const UpdateVehicleScreen = () => {
    const navigation = useNavigation<props>();
    const route = useRoute<RoutePropType>();
    const { vehicleId } = route.params;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [vehicleFiles, setVehicleFiles] = useState<Record<string, any[]>>({
        plate_id: [],
        insurance: [],
        technical_visit: [],
        vehicle_images: [],
    });
    const [vehicleTypeModal, setVehicleTypeModal] = useState(false);

    const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
        defaultValues: {
            plate_number: "",
            vehicle_type: "",
            capicity: "",
            year_model: "",
            plate_id: [],
            insurance: [],
            technical_visit: [],
            vehicle_images: [],
            vehicle_number: "",
        },
    });

    const vehicle_type = watch("vehicle_type");

    useEffect(() => {
        fetchVehicle();
    }, []);

    const fetchVehicle = async () => {
        try {
            setLoading(true);
            const vehicle = await getVehicleById(vehicleId);

            setValue("plate_number", vehicle.plateNumber);
            setValue("vehicle_type", vehicle.type);
            setValue("capicity", vehicle.capacity);
            setValue("year_model", vehicle.modelYear);
            setValue("vehicle_number", vehicle.id);

            const groupedDocs: Record<string, any[]> = {
                plate_id: vehicle.documents.filter((d) => d.type === "plateId") || [],
                insurance: vehicle.documents.filter((d) => d.type === "insurance") || [],
                technical_visit: vehicle.documents.filter((d) => d.type === "technicalVisit") || [],
                vehicle_images: vehicle.images || [],
            };

            setVehicleFiles(groupedDocs);
            Object.entries(groupedDocs).forEach(([key, value]) =>
                setValue(key as keyof FormValues, value)
            );
        } catch (err) {
            Alert.alert("Error", "Failed to load vehicle data.");
        } finally {
            setLoading(false);
        }
    };

    const onFileSelect = async (field: keyof FormValues) => {
        try {
            const file = await DocPicker();
            if (!file) return;

            setVehicleFiles((prev) => {
                let updated;

                if (field === "vehicle_images") {
                    // multiple images allowed
                    updated = [...(prev[field] || []), file];
                } else {
                    // single file replace
                    updated = [file];
                }

                // sync with RHF
                setValue(field, updated);

                return {
                    ...prev,
                    [field]: updated,
                };
            });

        } catch (error) {
            console.error("File selection failed:", error);
            Alert.alert("Error", "Failed to pick file");
        }
    };

    const handleSelectVehicleType = (type: string) => {
        setValue("vehicle_type", type);
        setVehicleTypeModal(false);
    };

    const handleRemoveFile = (field: keyof FormValues, index: number) => {
        setVehicleFiles((prev) => {
            const updated = prev[field].filter((_, i) => i !== index);

            setValue(field, updated);

            return {
                ...prev,
                [field]: updated,
            };
        });
    };

    const onSubmit = async (data: FormValues) => {
        try {
            setSaving(true);

            const formData = new FormData();

            const isLocalFile = (file: any) =>
                file?.uri?.startsWith("file://");

            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value
                        .filter(isLocalFile) // ✅ ONLY new files
                        .forEach((file, idx) => {
                            formData.append(key, {
                                uri: file.uri,
                                name: file.name || `file_${idx}.jpg`,
                                type: file.type || "image/jpeg",
                            } as any);
                        });
                } else {
                    formData.append(key, value as string);
                }
            });

            await updateVehicle(vehicleId, formData);

            Alert.alert("Success", "Vehicle updated successfully");
            navigation.goBack();

        } catch (err: any) {
            console.log("UPDATE ERROR:", err);
            Alert.alert("Error", "Failed to update vehicle");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#036BB4" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
            <AppHeader text="Edit Vehicle Details" onpress={() => navigation.goBack()} />
            <ScrollView className="px-4 py-4 space-y-4">
                <Text className="text-lg font-semibold text-gray-700">Vehicle Details</Text>

                {/* Text Inputs */}
                {[
                    { label: "Plate Number", name: "plate_number" },
                    { label: "Capacity", name: "capicity" },
                    { label: "Year / Model", name: "year_model" },
                    { label: "Vehicle Number", name: "vehicle_number" },
                ].map((field) => (
                    <Controller
                        key={field.name}
                        control={control}
                        name={field.name as keyof FormValues}
                        render={({ field: { value, onChange } }) => (
                            <View className="mb-3">
                                <Text className="text-gray-500 mb-1">{field.label}</Text>
                                <TextInput
                                    value={value as string}
                                    onChangeText={onChange}
                                    editable={false} // readonly as per requirement
                                    className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                                />
                            </View>
                        )}
                    />
                ))}

                {/* Vehicle Type Selector */}
                <SelectField2
                    label="Vehicle Type"
                    value={vehicle_type}
                    placeholder="Select vehicle type"
                    onPress={() => setVehicleTypeModal(true)}
                />

                {/* Vehicle Type Modal */}
                <Modal
                    visible={vehicleTypeModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setVehicleTypeModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setVehicleTypeModal(false)}
                        className="flex-1 bg-black/40 justify-end"
                    >
                        <TouchableOpacity activeOpacity={1} className="bg-white rounded-t-3xl p-5">
                            <Text className="text-lg font-semibold mb-4 text-center">Select Vehicle Type</Text>

                            {VEHICLE_TYPES.map((type) => {
                                const isSelected = vehicle_type === type;
                                return (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => handleSelectVehicleType(type)}
                                        className={`py-4 px-3 rounded-xl mb-2 ${isSelected ? "bg-[#036BB4]/10" : "bg-gray-50"
                                            }`}
                                    >
                                        <Text className={`text-base ${isSelected ? "text-[#036BB4] font-semibold" : "text-gray-800"}`}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}

                            <TouchableOpacity
                                onPress={() => setVehicleTypeModal(false)}
                                className="mt-3 py-4 rounded-xl bg-red-50"
                            >
                                <Text className="text-center text-red-500 font-semibold">Cancel</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

                {/* File Uploads */}
                {/* Document Uploads Row */}
                <View className="flex-row justify-between">
                    {(["plate_id", "insurance", "technical_visit"] as (keyof FormValues)[]).map((fieldName) => {
                        const labelMap: Record<string, string> = {
                            plate_id: "Plate ID",
                            insurance: "Insurance",
                            technical_visit: "Technical Visit",
                        };

                        return (
                            <View key={fieldName} className="flex-1 mx-1">
                                {/* Label */}
                                <Text className="font-semibold mb-2">
                                    {labelMap[fieldName]}
                                </Text>

                                {/* Box */}
                                <View className="bg-white p-2 rounded-xl relative">
                                    {/* Edit Button */}
                                    <TouchableOpacity
                                        onPress={() => onFileSelect(fieldName)}
                                        className="absolute top-1 right-1 bg-blue-500 w-6 h-6 rounded-full justify-center items-center z-10"
                                    >
                                        <EditIcon width={14} height={14} />
                                    </TouchableOpacity>

                                    {/* Images */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {vehicleFiles[fieldName]?.map((file, idx) => (
                                            <View key={idx} className="relative mr-2">
                                                <Image
                                                    source={{ uri: file.uri || file.url || file }}
                                                    style={{ width: 70, height: 80, borderRadius: 8 }}
                                                />

                                                {/* Remove */}
                                                <TouchableOpacity
                                                    onPress={() => handleRemoveFile(fieldName, idx)}
                                                    className="absolute top-1 right-1 bg-red-500 w-5 h-5 rounded-full justify-center items-center"
                                                >
                                                    <Text className="text-white text-xs">×</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View className="bg-white p-3 rounded-xl shadow-sm mb-6">
                    <Text className="font-semibold mb-2">Vehicle Images</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {vehicleFiles.vehicle_images?.map((file, idx) => (
                            <Image
                                key={idx}
                                source={{ uri: file.uri || file.url || file }}
                                style={{ width: 100, height: 100, borderRadius: 12, marginRight: 8 }}
                            />
                        ))}

                        <TouchableOpacity
                            className="w-24 h-24 bg-gray-200 rounded-xl justify-center items-center"
                            onPress={() => onFileSelect("vehicle_images")}
                        >
                            <EditIcon width={24} height={24} />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-6 mb-6">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="flex-1 border border-gray-300 py-4 rounded-full flex-row justify-center items-center"
                    >
                        <Text className="font-medium text-gray-700">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        disabled={saving}
                        className="flex-1 bg-[#036BB4] py-4 rounded-full flex-row justify-center items-center"
                    >
                        {saving ? <ActivityIndicator color="white" /> : <Text className="font-semibold text-white">Save</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UpdateVehicleScreen;