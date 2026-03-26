// components/driver/DriverCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Driver } from "../types";

interface Props {
    driver: Driver
    onOpen: () => void;
    onRemove: () => void;
}

export default function DriverCard({ driver, onOpen, onRemove }: Props) {
    return (
        <View className="bg-white p-4 rounded-xl mb-3 shadow-sm">

            <Text className="font-semibold">{driver.name}</Text>
            <Text className="text-gray-500">{driver.location}</Text>
            <Text className="text-gray-500">{driver.phone}</Text>

            <View className="flex-row justify-between mt-3">
                <TouchableOpacity onPress={onRemove}>
                    <Text className="text-red-500">Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onOpen}>
                    <Text className="text-blue-500">Open</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}