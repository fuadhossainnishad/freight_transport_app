import { memo } from "react";
import { View, Text } from "react-native";
import { Shipment } from "../../../domain/entities/shipment.entity";
import { Driver } from "../../driver/types";

type Props = {
  shipment: Shipment;
  driver: Driver | null;
};

export const ActiveShipmentDetail = memo(function ActiveShipmentDetail({
  shipment,
  driver,
}: Props) {
  return (
    <View className="mt-4 p-4 bg-white rounded-xl shadow-sm">
      <Text className="text-lg font-bold text-gray-900">{shipment.title}</Text>
      <Text className="text-sm text-gray-500 mt-1">Status: {shipment.status}</Text>

      <View className="mt-3">
        <Text className="text-sm font-semibold text-gray-800">Driver</Text>
        {shipment.driverId ? (
          driver ? (
            <>
              <Text className="text-sm text-gray-500 mt-1">{driver.name}</Text>
              <Text className="text-sm text-gray-500">{driver.phone ?? ""}</Text>
            </>
          ) : (
            <Text className="text-sm text-gray-400 mt-1">Loading driver...</Text>
          )
        ) : (
          <Text className="text-sm text-gray-400 mt-1">No driver assigned</Text>
        )}
      </View>
    </View>
  );
});