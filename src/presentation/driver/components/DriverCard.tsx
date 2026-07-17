import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { UserCircle } from "lucide-react-native";
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
    const { t } = useTranslation();

    return (
        <View className="bg-white p-4 rounded-2xl border border-gray-100">

            {/* HEADER: avatar + identity */}
            <View className="flex-row items-center">
                {driver.avatar ? (
                    <Image
                        source={{ uri: driver.avatar }}
                        className="w-14 h-14 rounded-full bg-gray-100"
                    />
                ) : (
                    <View className="w-14 h-14 rounded-full bg-[#036BB4]/10 items-center justify-center">
                        <UserCircle size={34} color="#036BB4" strokeWidth={1.5} />
                    </View>
                )}

                <View className="flex-1 ml-3">
                    <Text
                        className="text-base font-semibold text-gray-900"
                        numberOfLines={1}
                    >
                        {driver.name || t("driver.list.unnamed")}
                    </Text>

                    <View className="flex-row items-center mt-1 gap-1.5">
                        <PhoneIcon width={14} height={14} />
                        <Text className="text-gray-500 text-sm" numberOfLines={1}>
                            {driver.phone || "—"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ACTIONS */}
            <View className="flex-row justify-end items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <TouchableOpacity
                    className="bg-[#9900FF1A] w-9 h-9 rounded-full items-center justify-center"
                    activeOpacity={0.7}
                    onPress={onView}
                >
                    <EyeIcon width={18} height={18} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#036BB41A] w-9 h-9 rounded-full items-center justify-center"
                    activeOpacity={0.7}
                    onPress={onEdit}
                >
                    <EditIcon width={18} height={18} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#FF00001A] w-9 h-9 rounded-full items-center justify-center"
                    activeOpacity={0.7}
                    onPress={onDelete}
                >
                    <DeleteIcon width={18} height={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
