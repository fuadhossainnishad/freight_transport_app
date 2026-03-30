// EarningItem.tsx
import React from "react";
import { View, Text } from "react-native";
import { Earning } from "../types";

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "#FB6000", text: "#ffffff", label: "Pending" },
  CONFIRMED: { bg: "#4BB54B", text: "#ffffff", label: "Confirmed" },
};

interface Props {
  item: Earning;
}

const EarningItem: React.FC<Props> = ({ item }) => {
  const s = STATUS_STYLE[item.status] ?? { bg: "#f3f4f6", text: "#6b7280", label: item.status };

  return (
    <View className="flex-row border-t border-gray-200 bg-white">

      {/* Shipment Title */}
      <View className="flex-1 p-3 border-r border-gray-200 justify-center">
        <Text className="text-gray-800 font-medium">{item.date}</Text>
      </View>
      <View className="w-28  p-3 border-r border-gray-200 justify-center">
        <Text className="text-gray-800 font-medium">{item.amount}</Text>
      </View>

      {/* Status */}
      <View className="w-28 p-3 border-r border-gray-200 items-center justify-center">
        <Text
          className={`px-3 py-1 rounded-full text-white text-xs }`}
          style={{ backgroundColor: s.bg }}
        >
          {s.label}
        </Text>
      </View>

    </View>
  );
};

export default EarningItem;