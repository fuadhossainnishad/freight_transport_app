import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Truck, Pencil, Trash2 } from "lucide-react-native";
import { Vehicle } from "../../../domain/entities/vehicle";

interface Props {
    vehicle: Vehicle;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const PRIMARY = "#036BB4";
const DANGER = "#EF4444";

// Capacity is stored as a plain string. If it's just a number, append the unit
// so "4" reads as "4 Tons"; otherwise show whatever the backend has ("20 Tons").
const formatCapacity = (capacity?: string) => {
    if (!capacity) return null;
    const trimmed = capacity.trim();
    return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed} Tons` : trimmed;
};

const Stat = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-1">
        <Text className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{label}</Text>
        <Text className="text-[15px] font-semibold text-gray-900 mt-1" numberOfLines={1}>
            {value}
        </Text>
    </View>
);

const VehicleCard: React.FC<Props> = ({ vehicle, onView, onEdit, onDelete }) => {
    const cover = vehicle.images?.[0];
    const capacity = formatCapacity(vehicle.capacity);

    return (
        <View className="bg-white rounded-2xl mb-4 border border-gray-100 shadow-sm overflow-hidden">
            {/* Tap the card body to open details */}
            <TouchableOpacity activeOpacity={0.85} onPress={onView}>
                {/* Photo — fills the card width, full vehicle visible */}
                <View
                    className="w-full bg-gray-100 items-center justify-center"
                    style={{ aspectRatio: 4 / 3 }}
                >
                    {cover ? (
                        <Image
                            source={{ uri: cover }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Truck size={36} color="#9CA3AF" strokeWidth={1.5} />
                    )}
                </View>

                {/* Identity */}
                <View className="px-4 pt-3.5">
                    {!!vehicle.type && (
                        <Text className="text-[11px] font-bold tracking-wider uppercase" style={{ color: PRIMARY }}>
                            {vehicle.type}
                        </Text>
                    )}
                    <Text className="text-[16px] font-bold text-gray-900 mt-1 leading-5" numberOfLines={1}>
                        {vehicle.name || "Unnamed vehicle"}
                    </Text>
                </View>

                {/* Spec row */}
                <View className="flex-row mx-4 mt-4 pt-4 pb-4 border-t border-gray-100">
                    <Stat label="Capacity" value={capacity || "—"} />
                    <View className="w-px bg-gray-100 mx-3" />
                    <Stat label="Model" value={vehicle.modelYear || "—"} />
                </View>
            </TouchableOpacity>

            {/* Secondary actions */}
            <View className="flex-row border-t border-gray-100">
                <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center gap-2 py-3.5"
                    onPress={onEdit}
                >
                    <Pencil size={16} color="#4B5563" strokeWidth={2} />
                    <Text className="text-[13px] font-semibold text-gray-600">Edit</Text>
                </TouchableOpacity>

                <View className="w-px bg-gray-100" />

                <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center gap-2 py-3.5"
                    onPress={onDelete}
                >
                    <Trash2 size={16} color={DANGER} strokeWidth={2} />
                    <Text className="text-[13px] font-semibold" style={{ color: DANGER }}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VehicleCard;
