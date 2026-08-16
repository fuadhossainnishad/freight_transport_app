import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

import { useMonthNames } from "../i18n/useMonthNames";

type Props = {
    title: string;
    value: string | number;
    fullWidth?: boolean;
};

export default function StatCard({ title, value, fullWidth }: Props) {
    const { t } = useTranslation();
    const months = useMonthNames();
    // Store the index, not the label: a stored label would stay in the old
    // language after the user switches languages.
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [showMonths, setShowMonths] = useState(false);
    const monthLabel =
        selectedMonth === null ? t("components.statCard.thisMonth") : months[selectedMonth];

    return (
        <View
            className={`bg-white border border-gray-200 rounded-2xl p-4 ${fullWidth ? "w-full" : "flex-1"
                }`}
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 5,
                elevation: 2,
                zIndex: showMonths ? 999 : 1, // IMPORTANT
            }}
        >
            {/* Title */}
            <Text className="text-[#000000] text-sm">{title}</Text>
            <View className="flex-row items-center justify-between">
                {/* Value */}
                <Text className="text-2xl font-bold text-black mt-2">{value}</Text>


                <TouchableOpacity
                    className="items-center"
                    onPress={() => setShowMonths(!showMonths)}>
                    <Text style={{ color: "#2563EB", fontSize: 12 }}>
                        {monthLabel} ▼
                    </Text>
                </TouchableOpacity>

                {showMonths && (
                    <View
                        style={{
                            position: "absolute",
                            top: 30,
                            right: 0,
                            width: 150,
                            backgroundColor: "white",
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                            borderRadius: 8,
                            elevation: 10,
                            zIndex: 1000,
                        }}
                    >
                        {months.map((month, index) => (
                            <TouchableOpacity
                                key={month}
                                onPress={() => {
                                    setSelectedMonth(index);
                                    setShowMonths(false);
                                }}
                                style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                            >
                                <Text>{month}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}