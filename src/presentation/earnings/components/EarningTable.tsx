// EarningTable.tsx
import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Earning } from "../types";
import EarningItem from "./EarningItem";

interface Props {
  earnings: Earning[];
}

const EarningTable: React.FC<Props> = ({ earnings }) => {
  const { t } = useTranslation();

  return (
    <View className="border border-gray-200 rounded-lg overflow-hidden mt-4">

      {/* Table Header */}
      <View className="flex-row bg-[#036BB4]">
        <View className="flex-1 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">{t("earnings.table.date")}</Text>
        </View>
        <View className="w-28 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">{t("earnings.table.amount")}</Text>
        </View>
        <View className="w-28 p-3">
          <Text className="text-white text-center font-semibold">{t("earnings.table.status")}</Text>
        </View>
      </View>

      {/* Table Rows */}
      {earnings.length === 0 ? (
        <View className="p-4">
          <Text className="text-center text-gray-500">{t("earnings.table.empty")}</Text>
        </View>
      ) : (
        earnings.map((item) => <EarningItem key={item.id} item={item} />)
      )}
    </View>
  );
};

export default EarningTable;
