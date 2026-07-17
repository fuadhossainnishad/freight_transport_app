import React from "react";
import { View, Text, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { SearchX } from "lucide-react-native";
import { InvoiceListItem } from "../../../data/services/invoiceService";
import InvoiceItem from "./InvoiceItem";

interface Props {
  invoices: InvoiceListItem[];
  onView: (invoice: InvoiceListItem) => void;
  onDownload: (invoice: InvoiceListItem) => void;
}

const InvoiceTable: React.FC<Props> = ({ invoices, onView, onDownload }) => {
  const { t } = useTranslation();

  return (
    <View className="border border-gray-200 rounded-lg overflow-hidden mt-4">

      {/* Table Header */}
      <View className="flex-row bg-[#036BB4]">
        <View className="flex-1 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">{t("invoice.list.tableTitle")}</Text>
        </View>
        <View className="w-28 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">{t("invoice.list.tableStatus")}</Text>
        </View>
        <View className="w-28 p-3">
          <Text className="text-white text-center font-semibold">{t("invoice.list.tableActions")}</Text>
        </View>
      </View>

      {/* Table Rows */}
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.payment_id}
        renderItem={({ item }) => (
          <InvoiceItem
            invoice={item}
            onViewPress={onView}
            onDownloadPress={onDownload}
          />
        )}
        ListEmptyComponent={
          <View className="py-10 items-center px-6">
            <SearchX size={26} color="#9CA3AF" />
            <Text className="text-center text-gray-700 font-semibold mt-2">{t("invoice.list.noMatchTitle")}</Text>
            <Text className="text-center text-gray-500 text-[13px] mt-1">
              {t("invoice.list.noMatchSubtitle")}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default InvoiceTable;
