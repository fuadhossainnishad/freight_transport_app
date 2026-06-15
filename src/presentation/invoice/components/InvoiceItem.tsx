import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import Download from "../../../../assets/icons/download2.svg";
import ViewIcon from "../../../../assets/icons/view2.svg";
import { InvoiceListItem } from "../../../data/services/invoiceService";

interface Props {
    invoice: InvoiceListItem;
    onViewPress: (invoice: InvoiceListItem) => void;
    onDownloadPress: (invoice: InvoiceListItem) => void;
}

const InvoiceItem: React.FC<Props> = ({ invoice, onViewPress, onDownloadPress }) => {
    return (
        <View className="flex-row border-t border-gray-200 bg-white">

            {/* Shipment Title */}
            <View className="flex-1 p-3 border-r border-gray-200 justify-center">
                <Text className="text-gray-800 font-medium" numberOfLines={1}>
                    {invoice.shipment_title ?? invoice.invoice_no}
                </Text>
            </View>

            {/* Status */}
            <View className="w-28 p-3 border-r border-gray-200 items-center justify-center">
                <Text className="px-2 py-1 rounded text-black text-xs bg-green-500">
                    {invoice.status === "VERIFIED" ? "Paid" : invoice.status}
                </Text>
            </View>

            {/* Actions */}
            <View className="w-28 flex-row items-center justify-center space-x-3">
                <TouchableOpacity
                    className="bg-[#9900FF]/10 p-2 rounded-full"
                    onPress={() => onViewPress(invoice)}
                >
                    <ViewIcon width={16} height={16} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#FF0000]/10 p-2 rounded-full"
                    onPress={() => onDownloadPress(invoice)}
                >
                    <Download width={16} height={16} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default InvoiceItem;
