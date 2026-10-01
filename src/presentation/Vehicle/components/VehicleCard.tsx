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

const formatCapacity = (capacity?: string) => {
    if (!capacity) return null;
    const trimmed = capacity.trim();
    return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed} Tons` : trimmed;
};

const VehicleCard: React.FC<Props> = ({ vehicle, onView, onEdit, onDelete }) => {
    const cover = vehicle.images?.[0];
    const capacity = formatCapacity(vehicle.capacity);

    return (
        <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={onView}
            className="bg-white rounded-3xl mb-5 shadow-sm shadow-black/5 border border-gray-100 overflow-hidden"
        >
            {/* Top: Banner Image (16:9) */}
            <View className="w-full bg-gray-50 items-center justify-center border-b border-gray-50" style={{ aspectRatio: 16 / 9 }}>
                {cover ? (
                    <Image
                        source={{ uri: cover }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                ) : (
                    <Truck size={40} color="#9CA3AF" strokeWidth={1.5} />
                )}
            </View>

            {/* Body */}
            <View className="p-5">
                <View>
                    {!!vehicle.type && (
                        <Text className="text-[10px] font-extrabold tracking-widest text-[#036BB4] uppercase mb-1.5">
                            {vehicle.type}
                        </Text>
                    )}
                    <Text className="text-xl font-extrabold text-gray-900 leading-tight">
                        {vehicle.name || "Unnamed vehicle"}
                    </Text>
                </View>

                <View className="flex-row items-center mt-4 gap-8">
                    <View>
                        <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Capacity</Text>
                        <Text className="text-[15px] font-bold text-gray-800 mt-0.5">{capacity || "—"}</Text>
                    </View>
                    <View>
                        <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Model</Text>
                        <Text className="text-[15px] font-bold text-gray-800 mt-0.5">{vehicle.modelYear || "—"}</Text>
                    </View>
                </View>
            </View>

            {/* Footer Actions */}
            <View className="flex-row border-t border-gray-50 bg-gray-50/50 p-1.5">
                <TouchableOpacity
                    onPress={onEdit}
                    className="flex-1 flex-row justify-center items-center py-3 gap-2 rounded-xl"
                >
                    <Pencil size={16} color="#4B5563" strokeWidth={2.5} />
                    <Text className="text-[#4B5563] font-bold text-[14px]">Edit</Text>
                </TouchableOpacity>
                
                <View className="w-px bg-gray-200 my-2" />
                
                <TouchableOpacity
                    onPress={onDelete}
                    className="flex-1 flex-row justify-center items-center py-3 gap-2 rounded-xl"
                >
                    <Trash2 size={16} color="#EF4444" strokeWidth={2.5} />
                    <Text className="text-[#EF4444] font-bold text-[14px]">Delete</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default VehicleCard;
