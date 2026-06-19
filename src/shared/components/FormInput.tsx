import React from "react";
import { View, TextInput, Text, TouchableOpacity, KeyboardTypeOptions } from "react-native";
import { Controller } from "react-hook-form";

interface Props {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  rules?: any;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  required?: boolean;
}

export default function FormInput({
  control,
  name,
  label,
  placeholder,
  rules,
  keyboardType,
  autoCapitalize,
  required,
}: Props) {
  return (
    <View className="mb-5">

      <Text className="text-sm font-medium text-gray-700 mb-2">
        {label}
        {required ? <Text className="text-red-500"> *</Text> : null}
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
                placeholderTextColor="#9CA3AF"
                onChangeText={onChange}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
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