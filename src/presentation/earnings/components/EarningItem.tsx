// EarningItem.tsx
import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import { Earning } from "../types";
import { formatPrice } from "../../../shared/utils/price";
import { useFormatDate } from "../../../shared/i18n/useFormatDate";

const METHOD_STYLE: Record<string, { bg: string; labelKey: ParseKeys }> = {
  cash: { bg: "#4BB54B", labelKey: "earnings.methods.cash" },
  bank: { bg: "#8B5CF6", labelKey: "earnings.methods.bank" },
  online: { bg: "#036BB4", labelKey: "earnings.methods.online" },
};

interface Props {
  item: Earning;
}

const EarningItem: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const style = METHOD_STYLE[item.method] ?? { bg: "#6b7280", labelKey: undefined };

  return (
    <View className="flex-row border-t border-gray-200 bg-white">

      {/* Date */}
      <View className="flex-1 p-3 border-r border-gray-200 justify-center">
        <Text className="text-gray-800 font-medium" numberOfLines={1}>{formatDate(item.date)}</Text>
        <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>{item.companyName}</Text>
      </View>

      {/* Amount */}
      <View className="w-28 p-3 border-r border-gray-200 justify-center">
        <Text className="text-gray-800 font-medium">{formatPrice(item.amount)}</Text>
      </View>

      {/* Method */}
      <View className="w-28 p-3 items-center justify-center">
        <Text
          className="px-3 py-1 rounded-full text-white text-xs"
          style={{ backgroundColor: style.bg }}
        >
          {style.labelKey ? t(style.labelKey) : item.method}
        </Text>
      </View>

    </View>
  );
};

export default EarningItem;
