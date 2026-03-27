// components/driver/DriverForm.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import FormInput from "../../../shared/components/FormInput";
import UploadField from "../../../shared/components/UploadField";


export interface DriverFormValues {
    transporter_id: string
    name: string;
    phone: string;
    email: string;
    idFront: string[];
    idBack: string[];
}

interface Props {
    control: Control<DriverFormValues>;
    watch: UseFormWatch<DriverFormValues>;
    setValue: UseFormSetValue<DriverFormValues>;

    onSubmit: () => void;
    onRemove?: () => void;
    isEdit?: boolean;
}

export default function DriverForm({
    control,
    watch,
    setValue,
    onSubmit,
    onRemove,
    isEdit = false,
}: Props) {
    const idFront = watch("idFront") || [];
    const idBack = watch("idBack") || [];

    return (
        <View className="p-4">

            {/* ================= INPUTS ================= */}
            <FormInput
                control={control}
                name="name"
                label="Driver Name"
                placeholder="Enter driver name"
                rules={{ required: "Driver name is required" }}
            />

            <FormInput
                control={control}
                name="phone"
                label="Phone Number"
                placeholder="+880..."
                rules={{ required: "Phone number is required" }}
            />

            <FormInput
                control={control}
                name="email"
                label="Email"
                placeholder="Enter email"
                rules={{
                    required: "Email is required",
                    pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                    },
                }}
            />

            {/* ================= UPLOADS ================= */}
            <UploadField
                label="ID Card Front"
                files={idFront}
                onPress={(files) => setValue("idFront", files)}
            />

            <UploadField
                label="ID Card Back"
                files={idBack}
                onPress={(files) => setValue("idBack", files)}
            />

            {/* ================= ACTIONS ================= */}
            <View className="flex-row justify-between items-center mt-6">

                {/* Remove (only edit mode) */}
                {isEdit && onRemove && (
                    <TouchableOpacity onPress={onRemove}>
                        <Text className="text-red-500 font-semibold">
                            Remove Driver
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Submit */}
                <TouchableOpacity
                    onPress={onSubmit}
                    className="p-3 rounded-xl w-full mt-4 flex-row gap-3 items-center justify-center border border-[#036BB4]"
                >
                    <Text className="text-[#036BB4] text-center font-semibold">
                        {isEdit ? "Save & Change" : "Create Driver"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}