import React from "react";
import { View, Text, FlatList } from "react-native";
import { InvoiceListItem } from "../../../data/services/invoiceService";
import InvoiceItem from "./InvoiceItem";

interface Props {
  invoices: InvoiceListItem[];
  onView: (invoice: InvoiceListItem) => void;
  onDownload: (invoice: InvoiceListItem) => void;
}

const InvoiceTable: React.FC<Props> = ({ invoices, onView, onDownload }) => {
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
          <View className="p-4">
            <Text className="text-center text-gray-500">No invoices found</Text>
          </View>
        }
      />
    </View>
  );
};

export default InvoiceTable;
