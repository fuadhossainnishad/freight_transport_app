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
  /**
   * Maps the stored form value to display text. Needed where the form holds an
   * untranslated API value (e.g. category "Furniture") but the user must see
   * the translated label. Optional so existing callers are unaffected.
   */
  formatValue?: (value: string) => string
}

export default function SelectField({
  label,
  name,
  placeholder,
  control,
  onPress,
  formatValue,
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
              {value ? formatValue?.(value) ?? value : placeholder}
            </Text>

            <Selector width={20} height={20} />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}