import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";

interface Props {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  rules?: any;
}

export default function FormInput({
  control,
  name,
  label,
  placeholder,
  rules,
}: Props) {
  return (
    <View className="mb-5">

      <Text className="text-sm text-gray-500 mb-2">
        {label}
      </Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View>

            <View className="flex-row items-center border border-gray-200 rounded-lg px-3">

              <TextInput
                value={value}
                placeholder={placeholder}
                onChangeText={onChange}
                className="flex-1 py-3 text-black"
              />

              {value?.length > 0 && (
                <TouchableOpacity onPress={() => onChange("")}>
                  <Text className="text-gray-400">Clear</Text>
                </TouchableOpacity>
              )}

            </View>

            {error && (
              <Text className="text-red-500 text-xs mt-1">
                {error.message}
              </Text>
            )}

          </View>
        )}
      />

    </View>
  );
}