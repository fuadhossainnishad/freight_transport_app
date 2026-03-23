import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Selector from "../../../assets/icons/selector.svg";

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  onPress: () => void;
};

export default function SelectField2({
  label,
  value,
  placeholder = "Select",
  onPress,
}: Props) {
  return (
    <View className="mb-4">
      <Text className="font-semibold mb-2">{label}</Text>

      <TouchableOpacity
        onPress={onPress}
        className="border border-[#AEAEAE] p-3 rounded-lg flex-row justify-between items-center"
      >
        <Text className={`${value ? "text-black" : "text-gray-400"}`}>
          {value || placeholder}
        </Text>

        <Selector width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
}