import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { InvoiceStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AppHeader from '../../../shared/components/AppHeader';
import { SafeAreaView } from "react-native-safe-area-context";
import { getInvoiceDetail, InvoiceDetail } from "../../../data/services/invoiceService";
import { useFormatDate } from "../../../shared/i18n/useFormatDate";
import { useShipmentOptions } from "../../../shared/i18n/useShipmentOptions";
import { downloadInvoicePdf } from "../utils/invoicePdf";

type RoutePropType = RouteProp<InvoiceStackParamList, 'InvoiceDetails'>;
type NavigationPropType = NativeStackNavigationProp<InvoiceStackParamList, 'InvoiceDetails'>;

// NOTE: hardcoded € and a plain toFixed(2) — part of the app-wide currency
// inconsistency flagged in CLAUDE.md. Left alone deliberately; localising money
// needs a product decision, not an i18n change.
const CURRENCY = "€";

const formatAmount = (value?: number | null) =>
    `${CURRENCY}${(value ?? 0).toFixed(2)}`;

export default function InvoiceDetailsScreen() {
    const { t } = useTranslation();
    const formatDate = useFormatDate();
    // shipment_info.category is the untranslated API value ("Furniture").
    const { categoryLabel } = useShipmentOptions();
    const navigation = useNavigation<NavigationPropType>();
    const route = useRoute<RoutePropType>();
    const { paymentId } = route.params ?? {};

    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);

    const fetchDetail = useCallback(async () => {
        if (!paymentId) {
            setError(t("invoice.detail.notFound"));
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
            // Backend message wins when present — raw English, outside i18n.
            setError(err?.response?.data?.message || err.message || t("invoice.detail.loadFailed"));
        } finally {
            setLoading(false);
        }
    }, [paymentId, t]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    const handleDownload = useCallback(async () => {
        if (!invoice || downloading) return;
        try {
            setDownloading(true);
            const result = await downloadInvoicePdf(invoice);
            if (result === "saved") {
                Alert.alert(t("invoice.download.successTitle"), t("invoice.download.successMessage"));
            }
        } catch (err: any) {
            console.error("Error downloading invoice:", err);
            Alert.alert(t("invoice.download.failedTitle"), err?.message || t("invoice.download.failedMessage"));
        } finally {
            setDownloading(false);
        }
    }, [invoice, downloading, t]);

    if (loading) {
        return (
            <SafeAreaView edges={['top']} className="flex-1 bg-white">
                <AppHeader text={t("invoice.detail.title")} onpress={() => navigation.goBack()} />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#036BB4" />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !invoice) {
        return (
            <SafeAreaView edges={['top']} className="flex-1 bg-white">
                <AppHeader text={t("invoice.detail.title")} onpress={() => navigation.goBack()} />
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-gray-500 text-center">{error ?? t("invoice.detail.unavailable")}</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { invoice_summary, shipment_info, cost_breakdown } = invoice;
    const isPaid = invoice.status === "VERIFIED";

    const weightCategory = [
        shipment_info.weight != null ? t("invoice.detail.weightValue", { value: shipment_info.weight }) : null,
        // Stored English value -> translated label, raw fallback for legacy rows.
        shipment_info.category ? categoryLabel(shipment_info.category) : null,
    ].filter(Boolean).join(" / ") || "—";

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white">
            <AppHeader text={t("invoice.detail.title")} onpress={() => navigation.goBack()} />
            <ScrollView contentContainerClassName="px-5 pt-2 pb-8" showsVerticalScrollIndicator={false}>

                {/* Invoice no + status */}
                <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
                    <Text className="text-lg font-bold text-black flex-1 pr-3">
                        {t("invoice.detail.invoiceNo", { number: invoice.invoice_no })}
                    </Text>
                    <View className={`px-3 py-1 rounded-full ${isPaid ? "bg-green-500" : "bg-orange-500"}`}>
                        {/* Unmapped statuses still show the raw backend enum. */}
                        <Text className="text-xs font-semibold text-white">
                            {isPaid ? t("invoice.status.paid") : invoice.status}
                        </Text>
                    </View>
                </View>

                {/* Two-column info */}
                <View className="flex-row mt-5">
                    {/* Left: Invoice Summary */}
                    <View className="flex-1 pr-3">
                        <Text className="text-base font-bold text-black mb-3">{t("invoice.detail.summarySection")}</Text>
                        <Field label={t("invoice.detail.totalAmount")} value={formatAmount(invoice_summary.amount)} />
                        <Field label={t("invoice.detail.issuedOn")} value={formatDate(invoice_summary.issued_on)} />
                        <Field label={t("invoice.detail.dueDate")} value={formatDate(invoice_summary.due_date)} />
                        {/* payment_method is a raw API value rendered as-is — flagged, not mapped. */}
                        <Field label={t("invoice.detail.paymentMethod")} value={invoice_summary.payment_method ?? "—"} />
                    </View>

                    {/* Right: Shipment Information */}
                    <View className="flex-1 pl-3">
                        <Text className="text-base font-bold text-black mb-3">{t("invoice.detail.shipmentSection")}</Text>
                        <Field label={t("invoice.detail.shipmentId")} value={shipment_info.shipment_id ?? "—"} />
                        <Field label={t("invoice.detail.shipmentTitle")} value={shipment_info.shipment_title ?? "—"} />
                        <Field label={t("invoice.detail.pickupAddress")} value={shipment_info.pickup_address ?? "—"} />
                        <Field label={t("invoice.detail.deliveryAddress")} value={shipment_info.delivery_address ?? "—"} />
                        <Field label={t("invoice.detail.weightCategory")} value={weightCategory} />
                        <Field label={t("invoice.detail.dateOfDelivery")} value={formatDate(shipment_info.date_of_delivery)} />
                    </View>
                </View>

                {/* Cost Breakdown */}
                <Text className="text-lg font-bold text-black mt-10 mb-4">{t("invoice.detail.costBreakdown")}</Text>
                <View>
                    {/* Blue header */}
                    <View className="flex-row bg-[#036BB4] rounded-lg px-5 py-4">
                        <Text className="flex-1 text-white font-semibold text-[13px]">{t("invoice.detail.item")}</Text>
                        <Text className="w-28 text-white font-semibold text-[13px]">{t("invoice.detail.amount")}</Text>
                    </View>
                    <CostRow label={t("invoice.detail.transportFee")} value={formatAmount(cost_breakdown.transport_fee)} />
                    <CostRow label={t("invoice.detail.platformFee")} value={formatAmount(cost_breakdown.platform_fee)} />
                    <CostRow label={t("invoice.detail.total")} value={formatAmount(cost_breakdown.total)} />
                </View>

                {/* Actions */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    className="mt-8 flex-row items-center justify-center gap-2 border border-[#036BB4] rounded-full py-3.5"
                    onPress={handleDownload}
                    disabled={downloading}
                >
                    {downloading && <ActivityIndicator size="small" color="#036BB4" className="mr-1" />}
                    <Text className="text-[#036BB4] font-semibold text-[15px] py-2">{t("invoice.detail.download")}</Text>
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
