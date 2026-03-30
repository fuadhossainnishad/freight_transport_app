// components/FormInput.tsx
import React from "react";
import { View, Text, TextInput } from "react-native";

interface Props {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (text: string) => void;
  keyboardType?: "default" | "numeric";
}

const FormInput: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onChange,
  keyboardType = "default",
}) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-600 mb-1">{label}</Text>

      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
        keyboardType={keyboardType}
        className="border border-gray-300 rounded-lg px-4 py-3 text-black"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};

export default FormInput;