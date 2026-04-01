import React from "react";
import { View, Text, FlatList } from "react-native";
import { Shipment } from "../../../domain/entities/shipment.entity";
import ShipmentItem from "./InvoiceItem";

interface Props {
  shipments: Shipment[];
  onView: (shipment: Shipment) => void;
  onMap: (shipment: Shipment) => void;
}

const InvoiceTable: React.FC<Props> = ({ shipments, onView, onMap }) => {
  return (
    <View className="border border-gray-200 rounded-lg overflow-hidden mt-4">

      {/* Table Header */}
      <View className="flex-row bg-[#036BB4]">
        <View className="flex-1 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">Shipment Title</Text>
        </View>
        <View className="w-28 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">Status</Text>
        </View>
        <View className="w-28 p-3">
          <Text className="text-white text-center font-semibold">Actions</Text>
        </View>
      </View>

      {/* Table Rows */}
      <FlatList
        data={shipments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShipmentItem
            shipment={item}
            onViewPress={onView}
            onMapPress={onMap}
          />
        )}
        ListEmptyComponent={
          <View className="p-4">
            <Text className="text-center text-gray-500">No active shipment found</Text>
          </View>
        }
      />
    </View>
  );
};

export default InvoiceTable;