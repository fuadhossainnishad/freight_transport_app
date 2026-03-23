import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { VehicleFormValues } from "../types";
import InputField from "../../../shared/components/InputField";
import UploadField from "../../../shared/components/UploadField";
import SelectField2 from "../../../shared/components/SelectField2";

const VEHICLE_TYPES = [
    "Truck",
    "Trailer",
    "Pickup",
    "Van",
    "Covered Van",
    "Mini Truck",
];

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
    const [vehicleTypeModal, setVehicleTypeModal] = useState(false);

    const handleSelectVehicleType = (value: string) => {
        onChange("type", value);
        setVehicleTypeModal(false);
    };
    return (
        <ScrollView
            className="flex-1 bg-white"
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}

        >


            {/* Vehicle Details */}
            <View className="bg-white rounded-2xl px-4 ">
                <Text className="text-lg font-semibold  mb-4">Vehicle Details</Text>

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
                    autoCapitalize="characters"

                />
                <SelectField2
                    label="Vehicle Type"
                    value={values.type}
                    placeholder="Select vehicle type"
                    onPress={() => {
                        setVehicleTypeModal(true);
                    }}
                />
                {vehicleTypeModal &&
                    <Modal
                        visible={vehicleTypeModal}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setVehicleTypeModal(false)}
                    >
                        {/* Backdrop */}
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setVehicleTypeModal(false)}
                            className="flex-1 bg-black/40 justify-end"
                        >
                            {/* Bottom Sheet */}
                            <TouchableOpacity
                                activeOpacity={1}
                                className="bg-white rounded-t-3xl p-5"
                            >
                                <Text className="text-lg font-semibold mb-4 text-center">
                                    Select Vehicle Type
                                </Text>

                                {VEHICLE_TYPES.map((type) => {
                                    const isSelected = values.type === type;

                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            onPress={() => handleSelectVehicleType(type)}
                                            className={`py-4 px-3 rounded-xl mb-2 ${isSelected
                                                ? "bg-[#036BB4]/10"
                                                : "bg-gray-50"
                                                }`}
                                        >
                                            <Text
                                                className={`text-base ${isSelected
                                                    ? "text-[#036BB4] font-semibold"
                                                    : "text-gray-800"
                                                    }`}
                                            >
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}

                                {/* Cancel Button */}
                                <TouchableOpacity
                                    onPress={() => setVehicleTypeModal(false)}
                                    className="mt-3 py-4 rounded-xl bg-red-50"
                                >
                                    <Text className="text-center text-red-500 font-semibold">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Modal>}

                <InputField
                    label="Capacity"
                    placeholder="e.g. 20 Tons"
                    value={values.capacity || ""}
                    onChangeText={(v) => onChange("capacity", v)}
                    keyboardType="numeric"
                />

                <InputField
                    label="Year / Model"
                    placeholder="e.g. 2022"
                    value={values.modelYear || ""}
                    onChangeText={(v) => onChange("modelYear", v)}
                    keyboardType="number-pad"
                    maxLength={4}
                />
            </View>

            {/* Documents */}
            <View className="bg-white rounded-2xl px-4 flex-row gap-2 w-full">
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
            <View className="bg-white rounded-2xl px-4 ">
                <UploadField
                    multiple
                    label="Vehicle Image"
                    files={values.vehicleImages || []}
                    onPress={(files) => onChange("vehicleImages", files)}
                />
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 px-4">
                <TouchableOpacity
                    onPress={onCancel}
                    className="flex-1 border border-[#FF0000] py-4 rounded-full"
                >
                    <Text className="text-center font-medium text-gray-700">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onSubmit}
                    disabled={loading}
                    className="flex-1 bg-[#036BB4] py-4 rounded-full"
                >
                    <Text className="text-center font-semibold text-white">
                        {loading ? "Adding..." : "Add"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default VehicleForm;