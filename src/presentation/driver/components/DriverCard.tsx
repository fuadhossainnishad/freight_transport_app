import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PhoneIcon from "../../../../assets/icons/phone.svg";
import EyeIcon from "../../../../assets/icons/view2.svg";
import EditIcon from "../../../../assets/icons/edit3.svg";
import DeleteIcon from "../../../../assets/icons/delete.svg";

import { Driver } from "../types";

interface Props {
    driver: Driver;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function DriverCard({
    driver,
    onView,
    onEdit,
    onDelete,
}: Props) {
    return (
        <View className="flex-1 bg-white p-4 rounded-2xl border border-[#0000001A]">

            {/* NAME */}
            <Text className="text-base font-semibold text-gray-800">
                {driver.name}
            </Text>

            {/* PHONE */}
            <View className="flex-row items-center mt-2 gap-2">
                <PhoneIcon width={16} height={16} />
                <Text className="text-gray-500 text-sm">
                    +8801234567890
                </Text>
            </View>

            {/* ACTIONS */}
            <View className="flex-row justify-center items-center gap-2 mt-4 pt-3 border-t border-gray-100">

                <TouchableOpacity
                    className="bg-[#9900FF1A] p-2 rounded-full"
                    onPress={onView}>
                    <EyeIcon width={18} height={18} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#036BB41A] p-2 rounded-full"
                    onPress={onEdit}>
                    <EditIcon width={18} height={18} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#FF00001A] p-2 rounded-full"

                    onPress={onDelete}>
                    <DeleteIcon width={18} height={18} />
                </TouchableOpacity>

            </View>

        </View>
    );
}