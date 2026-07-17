import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReceiptText } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const navigation = useNavigation<Props>();

    const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const isSearching = search.trim().length > 0;

    const loadInvoices = async (searchTerm?: string) => {
        try {
            setLoading(true);
            const res = await getInvoices(1, 20, searchTerm);
            setInvoices(res.data);
        } catch (error: any) {
            console.error(error);
            // The backend message wins when present — it is raw English and
            // outside i18n. Only the fallback is ours.
            Alert.alert(t("common.error"), error?.response?.data?.message || error.message || t("invoice.list.loadFailed"));
        } finally {
            setLoading(false);
        }
    };

    // Mount-only. loadInvoices closes over `t`, so the linter wants it as a
    // dependency — but it is not memoised, so adding it would re-create it every
    // render and fire an endless fetch loop.
    useEffect(() => {
        loadInvoices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Debounced server-side search — same reasoning as above.
    useEffect(() => {
        const handler = setTimeout(() => {
            loadInvoices(search.trim() || undefined);
        }, 400);
        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                Alert.alert(t("invoice.download.successTitle"), t("invoice.download.successMessage"));
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert(t("invoice.download.failedTitle"), error?.response?.data?.message || error?.message || t("invoice.download.failedMessage"));
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white p-4">
            <View className='bg-white flex-row w-full p-4 items-center px-4'>
                <Text className='text-center text-lg font-semibold text-black w-full'>
                    {t("invoice.list.title")}
                </Text>
            </View>

            {/* Search — only relevant once there are invoices (or an active search). */}
            {!loading && (invoices.length > 0 || isSearching) && (
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder={t("invoice.list.search")}
                />
            )}

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : invoices.length === 0 && !isSearching ? (
                // No invoices at all — no search bar / table header, just a clean empty state.
                <View style={styles.fullEmpty}>
                    <View style={styles.emptyIconWrap}>
                        <ReceiptText size={34} color="#036BB4" />
                    </View>
                    <Text style={styles.emptyTitle}>{t("invoice.list.emptyTitle")}</Text>
                    <Text style={styles.emptySub}>
                        {t("invoice.list.emptySubtitle")}
                    </Text>
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

const styles = StyleSheet.create({
    fullEmpty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingBottom: 40 },
    emptyIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#EFF6FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    emptyTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
    emptySub: {
        fontSize: 13.5,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 6,
        lineHeight: 20,
        maxWidth: 300,
    },
});

export default InvoicesScreen;
