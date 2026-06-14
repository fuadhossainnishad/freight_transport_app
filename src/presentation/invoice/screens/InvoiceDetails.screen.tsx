import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { InvoiceStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AppHeader from '../../../shared/components/AppHeader';
import { SafeAreaView } from "react-native-safe-area-context";
import { getInvoiceDetail, InvoiceDetail } from "../../../data/services/invoiceService";
import { downloadInvoicePdf } from "../utils/invoicePdf";

type RoutePropType = RouteProp<InvoiceStackParamList, 'InvoiceDetails'>;
type NavigationPropType = NativeStackNavigationProp<InvoiceStackParamList, 'InvoiceDetails'>;

const CURRENCY = "€";

const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const formatAmount = (value?: number | null) =>
    `${CURRENCY}${(value ?? 0).toFixed(2)}`;

export default function InvoiceDetailsScreen() {
    const navigation = useNavigation<NavigationPropType>();
    const route = useRoute<RoutePropType>();
    const { paymentId } = route.params ?? {};

    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);

    const fetchDetail = useCallback(async () => {
        if (!paymentId) {
            setError("Invoice not found");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await getInvoiceDetail(paymentId);
            setInvoice(data);
        } catch (err: any) {
            console.error("Error fetching invoice detail:", err);
            setError(err?.response?.data?.message || err.message || "Failed to load invoice");
        } finally {
            setLoading(false);
        }
    }, [paymentId]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    const handleDownload = useCallback(async () => {
        if (!invoice || downloading) return;
        try {
            setDownloading(true);
            const result = await downloadInvoicePdf(invoice);
            if (result === "saved") {
                Alert.alert("Downloaded", "The invoice was saved to your device.");
            }
        } catch (err: any) {
            console.error("Error downloading invoice:", err);
            Alert.alert("Download failed", err?.message || "Could not save the invoice PDF");
        } finally {
            setDownloading(false);
        }
    }, [invoice, downloading]);

    if (loading) {
        return (
            <SafeAreaView edges={['top']} className="flex-1 bg-white">
                <AppHeader text="Invoice Summary" onpress={() => navigation.goBack()} />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#036BB4" />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !invoice) {
        return (
            <SafeAreaView edges={['top']} className="flex-1 bg-white">
                <AppHeader text="Invoice Summary" onpress={() => navigation.goBack()} />
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-gray-500 text-center">{error ?? "Invoice details not available"}</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { invoice_summary, shipment_info, cost_breakdown } = invoice;
    const isPaid = invoice.status === "VERIFIED";

    const weightCategory = [
        shipment_info.weight != null ? `${shipment_info.weight} kg` : null,
        shipment_info.category,
    ].filter(Boolean).join(" / ") || "—";

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white">
            <AppHeader text="Invoice Summary" onpress={() => navigation.goBack()} />
            <ScrollView contentContainerClassName="px-5 pt-2 pb-8" showsVerticalScrollIndicator={false}>

                {/* Invoice no + status */}
                <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
                    <Text className="text-lg font-bold text-black flex-1 pr-3">
                        Invoice {invoice.invoice_no}
                    </Text>
                    <View className={`px-3 py-1 rounded-full ${isPaid ? "bg-green-500" : "bg-orange-500"}`}>
                        <Text className="text-xs font-semibold text-white">
                            {isPaid ? "Paid" : invoice.status}
                        </Text>
                    </View>
                </View>

                {/* Two-column info */}
                <View className="flex-row mt-5">
                    {/* Left: Invoice Summary */}
                    <View className="flex-1 pr-3">
                        <Text className="text-base font-bold text-black mb-3">Invoice Summary</Text>
                        <Field label="Total amount" value={formatAmount(invoice_summary.amount)} />
                        <Field label="Issued on" value={formatDate(invoice_summary.issued_on)} />
                        <Field label="Due Date" value={formatDate(invoice_summary.due_date)} />
                        <Field label="Payment Method" value={invoice_summary.payment_method ?? "—"} />
                    </View>

                    {/* Right: Shipment Information */}
                    <View className="flex-1 pl-3">
                        <Text className="text-base font-bold text-black mb-3">Shipment Information</Text>
                        <Field label="Shipment ID" value={shipment_info.shipment_id ?? "—"} />
                        <Field label="Shipment title" value={shipment_info.shipment_title ?? "—"} />
                        <Field label="Pickup address" value={shipment_info.pickup_address ?? "—"} />
                        <Field label="Delivery address" value={shipment_info.delivery_address ?? "—"} />
                        <Field label="Weight / category" value={weightCategory} />
                        <Field label="Date of delivery" value={formatDate(shipment_info.date_of_delivery)} />
                    </View>
                </View>

                {/* Cost Breakdown */}
                <Text className="text-lg font-bold text-black mt-10 mb-4">Cost Breakdown</Text>
                <View>
                    {/* Blue header */}
                    <View className="flex-row bg-[#036BB4] rounded-lg px-5 py-4">
                        <Text className="flex-1 text-white font-semibold text-[13px]">Item</Text>
                        <Text className="w-28 text-white font-semibold text-[13px]">Amount</Text>
                    </View>
                    <CostRow label="Transport Fee" value={formatAmount(cost_breakdown.transport_fee)} />
                    <CostRow label="Platform Service Fee" value={formatAmount(cost_breakdown.platform_fee)} />
                    <CostRow label="Total" value={formatAmount(cost_breakdown.total)} />
                </View>

                {/* Actions */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    className="mt-8 flex-row items-center justify-center gap-2 border border-[#036BB4] rounded-full py-3.5"
                    onPress={handleDownload}
                    disabled={downloading}
                >
                    {downloading && <ActivityIndicator size="small" color="#036BB4" className="mr-1" />}
                    <Text className="text-[#036BB4] font-semibold text-[15px] py-2">Download invoice</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <View className="mb-4">
            <Text className="text-xs text-gray-400 mb-1">{label}</Text>
            <Text className="text-sm font-semibold text-black">{value}</Text>
        </View>
    );
}

function CostRow({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-row px-5 py-4">
            <Text className="flex-1 text-[14px] text-gray-500">{label}</Text>
            <Text className="w-28 text-[14px] font-medium text-black">{value}</Text>
        </View>
    );
}
