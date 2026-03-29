import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import RemoveIcon from '../../../../assets/icons/remove.svg'
type Props = {
    item: any;
    selected: boolean;
    onSelect: () => void;
    onRemove?: () => void;
};

export default function VehicleItem({ item, selected, onSelect, onRemove }: Props) {
    return (
        <TouchableOpacity
            onPress={onSelect}
            activeOpacity={0.7}
            className={`flex-row items-center justify-between p-3 mb-2 rounded-xl border ${selected ? "bg-green-50 border-green-300" : "bg-white border-gray-200"
                }`}
        >
            {/* Left: Image + Info */}
            <View className="flex-row items-center gap-3 flex-1">
                <Image
                    source={{
                        uri:
                            item?.vehicle_image?.[0] ||
                            "https://via.placeholder.com/100",
                    }}
                    style={{ width: 60, height: 60, borderRadius: 10 }}
                />

                <View className="flex-1">
                    <Text className="font-semibold text-sm">
                        {item.vehicle_type}
                    </Text>

                    <Text className="text-xs text-gray-500 mt-1">
                        {item.model || "Model N/A"}
                    </Text>

                    <Text className="text-xs text-gray-400">
                        Plate: {item.plate_number}
                    </Text>
                </View>
            </View>

            {/* Right: Remove */}
            {selected && (
                <TouchableOpacity
                    className="rounded-full p-2 bg-[#FF00001A]"
                    onPress={onRemove}>
                    <RemoveIcon height={24} width={24} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}