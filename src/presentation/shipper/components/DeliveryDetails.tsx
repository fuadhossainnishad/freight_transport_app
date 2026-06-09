import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { Controller, Control } from "react-hook-form"
import Checkbox from "../../../shared/components/Checkbox"
import AddressPickerField from "./AddressPickerField"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ShipperHomeStackParamList } from "../../../navigation/types"

type Props = {
  control: Control<any>
  onSubmit: () => void
}

type NavigationProps = NativeStackNavigationProp<ShipperHomeStackParamList>;

export default function DeliveryDetails({ control, onSubmit }: Props) {
  const navigation = useNavigation<NavigationProps>()

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">
        Pickup & Delivery Details
      </Text>

      <Controller
        control={control}
        name="pickup_address"
        render={({ field: { value } }) => (
          <AddressPickerField
            placeholder="Pickup Address"
            value={value}
            handlePress={() => {
              navigation.navigate("AddressPicker", {
                field: "pickup_address",
              })
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
        render={({ field: { value } }) => (
          <AddressPickerField
            placeholder="Delivery Address"
            value={value}
            handlePress={() => {
              navigation.navigate("AddressPicker", {
                field: "delivery_address",
              })
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
      <Text className="font-semibold mb-2">Description</Text>
      <View className="flex-row justify-between mb-4 gap-4">
        <Controller
          control={control}
          name="insurance"
          render={({ field: { onChange, value } }) => (
            <View className="border border-[#AEAEAE] p-3 rounded-lg flex-1">
              <Checkbox
                label="Insurance"
                checked={!!value}
                onToggle={() => onChange(!value)}
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name="forwarding"
          render={({ field: { onChange, value } }) => (
            <View className="border border-[#AEAEAE] p-3 rounded-lg flex-1">
              <Checkbox
                label="Forwarding"
                checked={!!value}
                onToggle={() => onChange(!value)}
              />
            </View>
          )}
        />
      </View>
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