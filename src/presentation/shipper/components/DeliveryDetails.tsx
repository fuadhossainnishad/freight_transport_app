import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { Controller, Control } from "react-hook-form"

type Props = {
  control: Control<any>
  onSubmit: () => void
}

export default function DeliveryDetails({ control, onSubmit }: Props) {

  return (
    <View className="p-4">

      <Text className="text-xl font-bold mb-4">
        Pickup & Delivery Details
      </Text>

      <Controller
        control={control}
        name="pickup_address"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border p-3 rounded-lg mb-4"
            placeholder="Pickup Address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="time_window"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border p-3 rounded-lg mb-4"
            placeholder="Time Window"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="delivery_address"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border p-3 rounded-lg mb-4"
            placeholder="Delivery Address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="contact_person"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border p-3 rounded-lg mb-4"
            placeholder="Contact Person Number"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="date_preference"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border p-3 rounded-lg mb-4"
            placeholder="Date Preference"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border p-3 rounded-lg mb-4"
            placeholder="Budget Price"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <TouchableOpacity
        onPress={onSubmit}
        className="bg-black p-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          Publish Shipment
        </Text>
      </TouchableOpacity>

    </View>
  )
}