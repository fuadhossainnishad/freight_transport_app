import { TouchableOpacity, Text } from "react-native";
import React from "react";

interface Props {
    title: string;
    onPress: () => void;
}

export default function SettingsItem({ title, onPress }: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row justify-between items-center py-4 border-b border-gray-200"
        >
            <Text className="text-base text-gray-800">{title}</Text>

            <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
    );
}