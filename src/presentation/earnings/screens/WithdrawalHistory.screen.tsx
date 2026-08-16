import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import { History, Globe, Landmark, Truck, MapPin } from "lucide-react-native";

import AppHeader from "../../../shared/components/AppHeader";
import { EarningsStackParamList } from "../../../navigation/types";
import { formatPrice } from "../../../shared/utils/price";
import { useFormatDate } from "../../../shared/i18n/useFormatDate";
import {
    getMyWithdrawals,
    WithdrawalListItem,
    WithdrawalStatus,
    WithdrawalPayoutMethod,
} from "../../../data/services/withdrawalService";

type NavigationProp = NativeStackNavigationProp<EarningsStackParamList, "WithdrawalHistory">;

const BLUE = "#036BB4";

const STATUS_COLORS: Record<WithdrawalStatus, { bg: string; fg: string }> = {
    pending: { bg: "#FEF3C7", fg: "#B45309" },
    approved: { bg: "#DCFCE7", fg: "#15803D" },
    rejected: { bg: "#FEE2E2", fg: "#B91C1C" },
};

const STATUS_LABEL_KEY: Record<WithdrawalStatus, ParseKeys> = {
    pending: "earnings.history.status.pending",
    approved: "earnings.history.status.approved",
    rejected: "earnings.history.status.rejected",
};

const METHOD_ICON: Record<WithdrawalPayoutMethod, any> = {
    online: Globe,
    bank: Landmark,
    cash: Truck,
};

const METHOD_LABEL_KEY: Record<WithdrawalPayoutMethod, ParseKeys> = {
    online: "earnings.methods.online",
    bank: "earnings.methods.bank",
    cash: "earnings.methods.cash",
};

export default function WithdrawalHistoryScreen() {
    const { t } = useTranslation();
    const formatDate = useFormatDate();
    const navigation = useNavigation<NavigationProp>();

    const [items, setItems] = useState<WithdrawalListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true); else setLoading(true);
        try {
            const res = await getMyWithdrawals(1, 20);
            setItems(res.data);
        } catch (err) {
            console.error("Failed to load withdrawal history:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const renderCard = ({ item }: { item: WithdrawalListItem }) => {
        const status = item.status;
        const colors = STATUS_COLORS[status] ?? STATUS_COLORS.pending;
        const method = item.payout_method ?? "online";
        const MethodIcon = METHOD_ICON[method] ?? Globe;

        return (
            <View style={s.card}>
                <View style={s.cardTop}>
                    <Text style={s.date}>{formatDate(item.createdAt)}</Text>
                    <View style={[s.badge, { backgroundColor: colors.bg }]}>
                        <Text style={[s.badgeTxt, { color: colors.fg }]}>{t(STATUS_LABEL_KEY[status] ?? STATUS_LABEL_KEY.pending)}</Text>
                    </View>
                </View>

                <Text style={s.amount}>{formatPrice(item.amount)}</Text>

                <View style={s.metaRow}>
                    <View style={s.metaItem}>
                        <MethodIcon size={14} color="#6B7280" />
                        <Text style={s.metaTxt}>{t(METHOD_LABEL_KEY[method] ?? METHOD_LABEL_KEY.online)}</Text>
                    </View>
                    <View style={s.metaItem}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={s.metaTxt} numberOfLines={1}>{item.region}</Text>
                    </View>
                </View>

                {status === "rejected" && item.rejection_reason ? (
                    <View style={s.rejectionBox}>
                        <Text style={s.rejectionLabel}>{t("earnings.history.rejectionReason")}</Text>
                        <Text style={s.rejectionTxt}>{item.rejection_reason}</Text>
                    </View>
                ) : null}
            </View>
        );
    };

    return (
        <SafeAreaView style={s.screen} edges={["top", "bottom"]}>
            <AppHeader text={t("earnings.history.title")} onpress={() => navigation.goBack()} />

            {loading ? (
                <View style={s.centered}>
                    <ActivityIndicator size="large" color={BLUE} />
                </View>
            ) : items.length === 0 ? (
                <View style={s.fullEmpty}>
                    <View style={s.emptyIconWrap}>
                        <History size={34} color={BLUE} />
                    </View>
                    <Text style={s.emptyTitle}>{t("earnings.history.emptyTitle")}</Text>
                    <Text style={s.emptySub}>{t("earnings.history.emptySubtitle")}</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item._id}
                    renderItem={renderCard}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={[BLUE]} tintColor={BLUE} />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#fff" },

    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#EEF2F6",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    date: { fontSize: 12.5, fontWeight: "600", color: "#9CA3AF" },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeTxt: { fontSize: 11, fontWeight: "700" },

    amount: { fontSize: 22, fontWeight: "800", color: BLUE, marginTop: 8 },

    metaRow: { flexDirection: "row", gap: 16, marginTop: 8 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 5, flexShrink: 1 },
    metaTxt: { fontSize: 12.5, color: "#6B7280", fontWeight: "500", flexShrink: 1 },

    rejectionBox: {
        marginTop: 12,
        backgroundColor: "#FEF2F2",
        borderRadius: 10,
        padding: 10,
    },
    rejectionLabel: { fontSize: 11, fontWeight: "700", color: "#B91C1C", textTransform: "uppercase", letterSpacing: 0.3 },
    rejectionTxt: { fontSize: 12.5, color: "#991B1B", marginTop: 3 },

    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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
    emptySub: { fontSize: 13.5, color: "#6B7280", textAlign: "center", marginTop: 6, lineHeight: 20, maxWidth: 300 },
});
