import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface Props extends TextInputProps {
    label: string;
    onChangeText: (value: string) => void;
}

const InputField: React.FC<Props> = ({ label, onChangeText, ...rest }) => {

    return (
        <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
                {label}
            </Text>

            <TextInput
                onChangeText={onChangeText}
                placeholderTextColor="#9CA3AF"
                className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
                {...rest}
            />
        </View>
    );
};

export default InputField;