import React from "react";
import { View, TextInput } from "react-native";

interface Props {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
}

export const SearchInput: React.FC<Props> = ({ value, onChange, placeholder }) => (
    <View className="mb-4 border border-gray-300 rounded-lg px-3 py-2">
        <TextInput
            placeholder={placeholder || "Search..."}
            value={value}
            onChangeText={onChange}
            className="text-black"
        />
    </View>
);