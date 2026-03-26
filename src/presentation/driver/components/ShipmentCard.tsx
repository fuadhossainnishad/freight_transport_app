// screens/driver/components/ShipmentCard.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Shipment } from "../types";

interface Props {
  shipment: Shipment;
  onPress?: () => void;
}

export default function ShipmentCard({ shipment, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-xl mb-3 shadow-sm"
    >
      <Text className="font-semibold text-black">
        {shipment.shipment_title}
      </Text>

      <Text className="text-gray-500 text-sm mt-1">
        {shipment.pickup_address} → {shipment.delivery_address}
      </Text>

      <View className="flex-row justify-between mt-2">
        <Text className="text-xs text-blue-500">
          {shipment.status}
        </Text>

        <Text className="text-xs text-gray-400">
          View
        </Text>
      </View>
    </TouchableOpacity>
  );
}