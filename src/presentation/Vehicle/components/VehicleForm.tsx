import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { VehicleFormValues } from "../types";
import InputField from "../../../shared/components/InputField";
import UploadField from "../../../shared/components/UploadField";

interface Props {
    values: VehicleFormValues;
    onChange: (field: keyof VehicleFormValues, value: string | string[]) => void;
    onSubmit: () => void;
    onCancel?: () => void;
    loading?: boolean;
}

const VehicleForm: React.FC<Props> = ({
    values,
    onChange,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            keyboardShouldPersistTaps="handled"
        >

            <Text className="text-2xl font-bold mb-4">Add Vehicle Details</Text>

            {/* Vehicle Details */}
            <View className="bg-white rounded-2xl p-4 mb-4">
                <Text className="text-lg font-semibold mb-4">Vehicle Details</Text>

                <InputField
                    label="Vehicle Name"
                    placeholder="Enter your vehicle name"
                    value={values.name || ""}
                    onChangeText={(v) => onChange("name", v)}
                />

                <InputField
                    label="Plate Number"
                    placeholder="Enter plate number"
                    value={values.plateNumber || ""}
                    onChangeText={(v) => onChange("plateNumber", v)}
                    keyboardType="default"

                />

                <InputField
                    label="Vehicle Type"
                    placeholder="e.g. Trailer, Truck"
                    value={values.type || ""}
                    onChangeText={(v) => onChange("type", v)}
                    keyboardType="default"

                />

                <InputField
                    label="Capacity"
                    placeholder="e.g. 20 Tons"
                    value={values.capacity || ""}
                    onChangeText={(v) => onChange("capacity", v)}
                />

                <InputField
                    label="Year / Model"
                    placeholder="e.g. 2022"
                    value={values.modelYear || ""}
                    onChangeText={(v) => onChange("modelYear", v)}
                />
            </View>

            {/* Documents */}
            <View className="bg-white rounded-2xl p-4 mb-4">
                <Text className="text-lg font-semibold mb-4">Documents</Text>
                <UploadField
                    label="Registration"
                    files={values.registration || []}
                    onPress={(files) => onChange("registration", files)}
                />
                <UploadField
                    label="Insurance"
                    files={values.insurance || []}
                    onPress={(files) => onChange("insurance", files)}
                />
                <UploadField
                    label="Plate ID"
                    files={values.plateId || []}
                    onPress={(files) => onChange("plateId", files)}
                />
            </View>

            {/* Vehicle Images */}
            <View className="bg-white rounded-2xl p-4 mb-6">
                <Text className="text-lg font-semibold mb-4">Vehicle Images</Text>
                <UploadField
                    label="Upload Vehicle Image"
                    files={values.vehicleImages || []}
                    onPress={(files) => onChange("vehicleImages", files)}
                />
            </View>

            {/* Actions */}
            <View className="flex-row mb-6">
                {onCancel && (
                    <TouchableOpacity
                        onPress={onCancel}
                        className="flex-1 border border-gray-300 py-4 rounded-xl mr-2"
                    >
                        <Text className="text-center font-medium text-gray-700">Cancel</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={onSubmit}
                    disabled={loading}
                    className="flex-1 bg-black py-4 rounded-xl ml-2"
                >
                    <Text className="text-center font-semibold text-white">
                        {loading ? "Saving..." : "Save"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default VehicleForm;