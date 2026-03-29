import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import RemoveIcon from '../../../../assets/icons/remove.svg'
import PhoneIcon from '../../../../assets/icons/phone.svg'

type Props = {
    item: any;
    selected: boolean;
    onSelect: () => void;
    onRemove?: () => void;
};

export default function DriverItem({ item, selected, onSelect, onRemove }: Props) {
    return (
        <TouchableOpacity
            onPress={onSelect}
            activeOpacity={0.7}
            className={`flex-row items-center justify-between p-3 mb-2 rounded-xl border ${selected ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
                }`}
        >
            {/* Left: Avatar + Info */}
            <View className="flex-row items-center gap-3 flex-1">
                <Image
                    source={{
                        uri:
                            item?.profile_picture?.[0] ||
                            "https://i.pravatar.cc/100",
                    }}
                    style={{ width: 50, height: 50, borderRadius: 22 }}
                />

                <View className="flex-1">
                    <Text className="font-semibold text-sm">
                        {item.driver_name}
                    </Text>

                    <View className="flex-row items-center gap-1 mt-1">
                        <PhoneIcon height={14} width={14} />
                        <Text className="text-sm text-gray-500">
                            {item.phone}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Right: Remove Icon */}
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