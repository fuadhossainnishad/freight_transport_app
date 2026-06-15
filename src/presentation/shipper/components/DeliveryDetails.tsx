import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { Controller, Control } from "react-hook-form"
import LocationPickerInput, { LatLng } from "../../../shared/components/LocationPickerInput"

type Props = {
  control: Control<any>
  onSubmit: () => void
  pickupCoord: LatLng | null
  deliveryCoord: LatLng | null
  setPickupCoord: (c: LatLng | null) => void
  setDeliveryCoord: (c: LatLng | null) => void
}


export default function DeliveryDetails({
  control,
  onSubmit,
  pickupCoord,
  deliveryCoord,
  setPickupCoord,
  setDeliveryCoord,
}: Props) {

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">
        Pickup & Delivery Details
      </Text>

      <Controller
        control={control}
        name="pickup_address"
        render={({ field: { onChange, value } }) => (
          <LocationPickerInput
            label="Pickup Location"
            placeholder="Search pickup address"
            address={value || ""}
            coord={pickupCoord}
            onChange={(addr, c) => {
              onChange(addr)
              setPickupCoord(c)
            }}
          />
        )}
      />

      <Text className="font-semibold mb-1 text-[#1A1C1E]">Time Window</Text>
      <Controller
        control={control}
        name="time_window"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
            placeholder="e.g. 9:00 AM - 5:00 PM"
            placeholderTextColor="#9AA0A6"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="delivery_address"
        render={({ field: { onChange, value } }) => (
          <LocationPickerInput
            label="Delivery Location"
            placeholder="Search delivery address"
            address={value || ""}
            coord={deliveryCoord}
            onChange={(addr, c) => {
              onChange(addr)
              setDeliveryCoord(c)
            }}
          />
        )}
      />

      <Text className="font-semibold mb-1 text-[#1A1C1E]">Contact Person Number</Text>
      <Controller
        control={control}
        name="contact_person"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
            placeholder="e.g. +1 555 123 4567"
            placeholderTextColor="#9AA0A6"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />

      <Text className="font-semibold mb-1 text-[#1A1C1E]">Date Preference</Text>
      <Controller
        control={control}
        name="date_preference"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
            placeholder="e.g. 25 June 2026"
            placeholderTextColor="#9AA0A6"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text className="font-semibold mb-1 text-[#1A1C1E]">Budget Price</Text>
      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
            placeholder="e.g. 1200"
            placeholderTextColor="#9AA0A6"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />

      <TouchableOpacity
        onPress={onSubmit}
        className="bg-[#036BB4] p-4 rounded-full"
      >
        <Text className="text-white text-center font-semibold">
          Publish Shipment
        </Text>
      </TouchableOpacity>
    </View>
  )
}