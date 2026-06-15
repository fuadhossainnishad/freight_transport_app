import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { InvoiceStackParamList } from "../../../navigation/types";
import { getInvoices, getInvoiceDetail, InvoiceListItem } from "../../../data/services/invoiceService";
import InvoiceTable from "../components/InvoiceTable";
import { SearchInput } from "../../settings/components/SearchInput";
import { downloadInvoicePdf } from "../utils/invoicePdf";

type Props = NativeStackNavigationProp<
    InvoiceStackParamList,
    "Invoices"
>;

const InvoicesScreen = () => {
    const navigation = useNavigation<Props>();

    const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const loadInvoices = async (searchTerm?: string) => {
        try {
            setLoading(true);
            const res = await getInvoices(1, 20, searchTerm);
            setInvoices(res.data);
        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error?.response?.data?.message || error.message || "Failed to load invoices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvoices();
    }, []);

    // Debounced server-side search
    useEffect(() => {
        const handler = setTimeout(() => {
            loadInvoices(search.trim() || undefined);
        }, 400);
        return () => clearTimeout(handler);
    }, [search]);

    const handleView = (invoice: InvoiceListItem) => {
        navigation.navigate("InvoiceDetails", { paymentId: invoice.payment_id });
    };

    const handleDownload = async (invoice: InvoiceListItem) => {
        if (downloadingId) return;
        try {
            setDownloadingId(invoice.payment_id);
            const detail = await getInvoiceDetail(invoice.payment_id);
            const result = await downloadInvoicePdf(detail);
            if (result === "saved") {
                Alert.alert("Downloaded", "The invoice was saved to your device.");
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert("Download failed", error?.response?.data?.message || error?.message || "Could not save the invoice PDF");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white p-4">
            <View className='bg-white flex-row w-full p-4 items-center px-4'>
                <Text className='text-center text-lg font-semibold text-black w-full'>
                    Invoices
                </Text>
            </View>

            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search invoice"
            />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : (
                <InvoiceTable
                    invoices={invoices}
                    onView={handleView}
                    onDownload={handleDownload}
                />
            )}
        </SafeAreaView>
    );
};

export default InvoicesScreen;
