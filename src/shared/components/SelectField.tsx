import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Control, Controller } from "react-hook-form"
import Selector from "../../../assets/icons/selector.svg"

type Props = {
  label: string
  name: string
  placeholder: string
  control: Control<any>
  onPress: () => void
}

export default function SelectField({
  label,
  name,
  placeholder,
  control,
  onPress,
}: Props) {
  return (
    <View className="mb-4">
      <Text className="font-semibold mb-2">{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { value } }) => (
          <TouchableOpacity
            onPress={onPress}
            className="border border-[#AEAEAE] p-3 rounded-lg flex-row justify-between items-center"
          >
            <Text className={`${value ? "text-black" : "text-gray-400"}`}>
              {value || placeholder}
            </Text>

            <Selector width={20} height={20} />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}