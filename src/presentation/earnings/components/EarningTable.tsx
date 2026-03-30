// EarningTable.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import { Earning } from "../types";
import EarningItem from "./EarningItem";

interface Props {
  earnings: Earning[];
}

const EarningTable: React.FC<Props> = ({ earnings }) => {
  return (
    <View className="border border-gray-200 rounded-lg overflow-hidden mt-4">

      {/* Table Header */}
      <View className="flex-row bg-[#036BB4]">
        <View className="flex-1 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">Date</Text>
        </View>
        <View className="w-28 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">Amount</Text>
        </View>
        <View className="w-28 p-3">
          <Text className="text-white text-center font-semibold">Status</Text>
        </View>
      </View>

      {/* Table Rows */}
      <FlatList
        data={earnings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EarningItem item={item} />
        )}
        ListEmptyComponent={
          <View className="p-4">
            <Text className="text-center text-gray-500">No earnings found</Text>
          </View>
        }
      />
    </View>
  );
};

export default EarningTable;