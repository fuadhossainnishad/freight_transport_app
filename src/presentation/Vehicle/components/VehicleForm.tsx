import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
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

const PRIMARY = "#036BB4";

export type VehicleFormErrors = Partial<Record<keyof VehicleFormValues, string>>;

interface Props {
    values: VehicleFormValues;
    errors?: VehicleFormErrors;
    onChange: (field: keyof VehicleFormValues, value: string | string[]) => void;
    onSubmit: () => void;
    onCancel?: () => void;
    loading?: boolean;
    submitLabel?: string;
    submittingLabel?: string;
}

const ErrorText = ({ message }: { message?: string }) =>
    message ? <Text className="text-red-500 text-xs -mt-3 mb-3">{message}</Text> : null;

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
    title,
    subtitle,
    children,
}) => (
    <View className="bg-white rounded-2xl px-4 pt-4 pb-1 mb-4 border border-gray-100">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        {subtitle ? <Text className="text-xs text-gray-500 mt-0.5 mb-4">{subtitle}</Text> : <View className="mb-4" />}
        {children}
    </View>
);

const VehicleForm: React.FC<Props> = ({
    values,
    errors = {},
    onChange,
    onSubmit,
    onCancel,
    loading,
    submitLabel = "Add Vehicle",
    submittingLabel = "Adding...",
}) => {
    const [vehicleTypeModal, setVehicleTypeModal] = useState(false);

    const handleSelectVehicleType = (value: string) => {
        onChange("vehicle_type", value);
        setVehicleTypeModal(false);
    };

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
            {/* Vehicle Details */}
            <SectionCard title="Vehicle Details" subtitle="Basic information about your vehicle.">
                <InputField
                    label="Vehicle Number *"
                    placeholder="Enter vehicle number"
                    value={values.vehicle_number || ""}
                    onChangeText={(v) => onChange("vehicle_number", v)}
                />
                <ErrorText message={errors.vehicle_number} />

                <InputField
                    label="Plate Number *"
                    placeholder="Enter plate number"
                    value={values.plate_number || ""}
                    onChangeText={(v) => onChange("plate_number", v)}
                    keyboardType="default"
                    autoCapitalize="characters"
                />
                <ErrorText message={errors.plate_number} />

                <SelectField2
                    label="Vehicle Type *"
                    value={values.vehicle_type}
                    placeholder="Select vehicle type"
                    onPress={() => setVehicleTypeModal(true)}
                />
                <ErrorText message={errors.vehicle_type} />

                <InputField
                    label="Capacity (Tons) *"
                    placeholder="Enter capacity in tons"
                    value={values.capicity || ""}
                    onChangeText={(v) => onChange("capicity", v)}
                    keyboardType="numeric"
                />
                <ErrorText message={errors.capicity} />

                <InputField
                    label="Year Model *"
                    placeholder="e.g. 2022"
                    value={values.year_model || ""}
                    onChangeText={(v) => onChange("year_model", v)}
                    keyboardType="number-pad"
                    maxLength={4}
                />
                <ErrorText message={errors.year_model} />
            </SectionCard>

            {/* Documents */}
            <SectionCard
                title="Documents"
                subtitle="Upload clear photos or PDFs. All documents are required."
            >
                <UploadField
                    label="Plate ID Document *"
                    files={values.plate_id || []}
                    onPress={(files) => onChange("plate_id", files)}
                />
                <ErrorText message={errors.plate_id} />

                <UploadField
                    label="Insurance Document *"
                    files={values.insurance || []}
                    onPress={(files) => onChange("insurance", files)}
                />
                <ErrorText message={errors.insurance} />

                <UploadField
                    label="Technical Visit Document *"
                    files={values.technical_visit || []}
                    onPress={(files) => onChange("technical_visit", files)}
                />
                <ErrorText message={errors.technical_visit} />
            </SectionCard>

            {/* Vehicle Images */}
            <SectionCard
                title="Vehicle Photos"
                subtitle="Add at least one photo of the vehicle. You can add multiple."
            >
                <UploadField
                    multiple
                    label="Vehicle Image *"
                    files={values.vehicle_images || []}
                    onPress={(files) => onChange("vehicle_images", files)}
                />
                <ErrorText message={errors.vehicle_images} />
            </SectionCard>

            {/* Vehicle Type bottom sheet */}
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
                    <TouchableOpacity activeOpacity={1} className="bg-white rounded-t-3xl p-5 pb-8">
                        <View className="w-10 h-1.5 bg-gray-200 rounded-full self-center mb-4" />
                        <Text className="text-lg font-semibold mb-4 text-center">Select Vehicle Type</Text>

                        {VEHICLE_TYPES.map((type) => {
                            const isSelected = values.vehicle_type === type;
                            return (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => handleSelectVehicleType(type)}
                                    className={`py-4 px-3 rounded-xl mb-2 ${isSelected ? "bg-[#036BB4]/10" : "bg-gray-50"}`}
                                >
                                    <Text
                                        className={`text-base ${isSelected ? "text-[#036BB4] font-semibold" : "text-gray-800"}`}
                                    >
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Actions */}
            <View className="flex-row gap-3 mt-1">
                <TouchableOpacity
                    onPress={onCancel}
                    disabled={loading}
                    className="flex-1 border border-gray-300 py-4 rounded-full"
                >
                    <Text className="text-center font-semibold text-gray-700">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onSubmit}
                    disabled={loading}
                    style={{ backgroundColor: PRIMARY, opacity: loading ? 0.7 : 1 }}
                    className="flex-1 py-4 rounded-full"
                >
                    <Text className="text-center font-semibold text-white">
                        {loading ? submittingLabel : submitLabel}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default VehicleForm;
