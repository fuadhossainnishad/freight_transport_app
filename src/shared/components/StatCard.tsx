import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useTranslation } from "react-i18next";

import { useMonthNames } from "../i18n/useMonthNames";

type Props = {
    title: string;
    value: string | number;
    fullWidth?: boolean;
    selectedMonth?: number | null;
    onMonthChange?: (month: number) => void;
    isLoading?: boolean;
};

export default function StatCard({ title, value, fullWidth, selectedMonth, onMonthChange, isLoading }: Props) {
    const { t } = useTranslation();
    const months = useMonthNames();
    const [showMonths, setShowMonths] = useState(false);
    const opacity = useRef(new Animated.Value(0.4)).current;
    
    const monthLabel =
        selectedMonth === undefined || selectedMonth === null 
            ? t("components.statCard.thisMonth") 
            : months[selectedMonth];

    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
                    Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        } else {
            opacity.stopAnimation();
            opacity.setValue(1);
        }
    }, [isLoading, opacity]);

    if (isLoading) {
        return (
            <Animated.View
                style={{ opacity }}
                className={`${fullWidth ? "w-full" : "flex-1"} h-24 bg-gray-200 rounded-2xl`}
            />
        );
    }

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
                                    if (onMonthChange) onMonthChange(index);
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