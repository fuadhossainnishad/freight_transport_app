import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { UserCircle, Phone, Eye, Edit2, Trash2, Mail, MapPin } from "lucide-react-native";

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
        <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-3">

            {/* HEADER: avatar + identity */}
            <View className="flex-row items-start">
                {driver.avatar ? (
                    <Image
                        source={{ uri: driver.avatar }}
                        className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200"
                    />
                ) : (
                    <View className="w-14 h-14 rounded-full bg-[#036BB4]/10 items-center justify-center border border-[#036BB4]/20">
                        <UserCircle size={32} color="#036BB4" strokeWidth={1.5} />
                    </View>
                )}

                <View className="flex-1 ml-4">
                    <Text
                        className="text-base font-bold text-gray-900"
                        numberOfLines={1}
                    >
                        {driver.name || t("driver.list.unnamed")}
                    </Text>

                    <View className="flex-row items-center mt-1.5 gap-2">
                        <Phone size={13} color="#6B7280" />
                        <Text className="text-gray-500 text-sm font-medium" numberOfLines={1}>
                            {driver.phone || "—"}
                        </Text>
                    </View>

                    {driver.email ? (
                        <View className="flex-row items-center mt-1 gap-2">
                            <Mail size={13} color="#6B7280" />
                            <Text className="text-gray-500 text-sm font-medium" numberOfLines={1}>
                                {driver.email}
                            </Text>
                        </View>
                    ) : null}

                    {driver.country ? (
                        <View className="flex-row items-center mt-1 gap-2">
                            <MapPin size={13} color="#6B7280" />
                            <Text className="text-gray-500 text-sm font-medium" numberOfLines={1}>
                                {driver.country}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            {/* ACTIONS */}
            <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <TouchableOpacity
                    className="flex-row items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200"
                    activeOpacity={0.7}
                    onPress={onView}
                >
                    <Eye size={15} color="#4B5563" />
                    <Text className="text-sm font-semibold text-gray-600">{t("driver.list.viewProfile", "View Profile")}</Text>
                </TouchableOpacity>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        className="flex-row items-center justify-center w-8 h-8 rounded-full bg-blue-50"
                        activeOpacity={0.7}
                        onPress={onEdit}
                    >
                        <Edit2 size={15} color="#2563eb" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center justify-center w-8 h-8 rounded-full bg-red-50"
                        activeOpacity={0.7}
                        onPress={onDelete}
                    >
                        <Trash2 size={15} color="#dc2626" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
