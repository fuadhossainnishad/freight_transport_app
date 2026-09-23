import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

import Download from "../../../../assets/icons/download2.svg";
import ViewIcon from "../../../../assets/icons/view2.svg";
import { InvoiceListItem } from "../../../data/services/invoiceService";
import { isInvoicePaid } from "../utils/invoiceStatus";

interface Props {
    invoice: InvoiceListItem;
    onViewPress: (invoice: InvoiceListItem) => void;
    onDownloadPress: (invoice: InvoiceListItem) => void;
}

const InvoiceItem: React.FC<Props> = ({ invoice, onViewPress, onDownloadPress }) => {
    const { t } = useTranslation();

    return (
        <View className="flex-row border-t border-gray-200 bg-white min-h-[64px]">

            {/* Shipment Title */}
            <View className="flex-1 py-4 px-3 border-r border-gray-200 justify-center">
                <Text className="text-gray-800 font-medium" numberOfLines={1}>
                    {invoice.shipment_title ?? invoice.invoice_no}
                </Text>
            </View>

            {/* Status */}
            <View className="w-28 py-4 px-3 border-r border-gray-200 items-center justify-center">
                {/* Status is a backend enum and never translated. Casing is
                    unconfirmed, so the compare is case-insensitive; unmapped
                    statuses still fall through as the raw value, as before. */}
                <Text className="px-2 py-1 rounded text-black text-xs bg-green-500">
                    {isInvoicePaid(invoice.status) ? t("invoice.status.paid") : invoice.status}
                </Text>
            </View>

            {/* Actions */}
            <View className="w-28 py-4 px-3 flex-row items-center justify-center gap-3">
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
