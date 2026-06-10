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

      <Controller
        control={control}
        name="time_window"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
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

      <Controller
        control={control}
        name="contact_person"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
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
            className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
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
            className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
            placeholder="Budget Price"
            value={value}
            onChangeText={onChange}
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