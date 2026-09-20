import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import { Search, SearchX, ReceiptText, MapPin, CreditCard, RefreshCw } from "lucide-react-native";

import { usePaymentRequests } from "../PaymentRequestsContext";
import { PaymentRequest, PaymentRequestStatus, isPayable } from "../../../domain/entities/paymentRequest.entity";
import { checkDmpStatus } from "../../../data/services/paymentRequestService";
import { formatPrice } from "../../../shared/utils/price";
import CompletePaymentModal from "../components/CompletePaymentModal";
import PaymentRequestSkeleton from "../components/PaymentRequestSkeleton";

const BLUE = "#036BB4";

const STATUS_COLORS: Record<PaymentRequestStatus, { bg: string; fg: string }> = {
  pending:           { bg: "#FEF3C7", fg: "#B45309" },
  dmp_pending:       { bg: "#FEF3C7", fg: "#B45309" },
  online_processing: { bg: "#DBEAFE", fg: "#1D4ED8" },
  cash_pending:      { bg: "#FEF3C7", fg: "#B45309" },
  bank_pending:      { bg: "#FEF3C7", fg: "#B45309" },
  completed:         { bg: "#DCFCE7", fg: "#15803D" },
  verified:          { bg: "#DCFCE7", fg: "#15803D" },
  rejected:          { bg: "#FEE2E2", fg: "#B91C1C" },
  cancelled:         { bg: "#F1F5F9", fg: "#64748B" },
};

const STATUS_LABEL_KEY: Record<PaymentRequestStatus, ParseKeys> = {
  pending: "payment.status.pending",
  dmp_pending: "payment.status.pending",
  online_processing: "payment.status.processing",
  cash_pending: "payment.status.cashPending",
  bank_pending: "payment.status.bankPending",
  completed: "payment.status.paid",
  verified: "payment.status.verified",
  rejected: "payment.status.rejected",
  cancelled: "payment.status.cancelled",
};

export default function PaymentRequestsScreen() {
  const { t } = useTranslation();
  const { requests, loading, refresh } = usePaymentRequests();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState<PaymentRequest | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  // DMP has no webhook — a shipper who paid via the emailed pay link has no
  // other way to make the app notice, so give them an explicit "Check status"
  // action rather than leaving the request stuck at dmp_pending forever.
  const handleCheckDmpStatus = useCallback(
    async (item: PaymentRequest) => {
      if (checkingId) return;
      setCheckingId(item.id);
      try {
        const result = await checkDmpStatus(item.id);
        if (result.dmp_status === "completed") {
          await refresh();
          Alert.alert(t("payment.requests.dmpCheckPaidTitle"), t("payment.requests.dmpCheckPaidMessage"));
        } else {
          Alert.alert(t("payment.requests.dmpCheckPendingTitle"), t("payment.requests.dmpCheckPendingMessage"));
        }
      } catch (err: any) {
        Alert.alert(
          t("payment.requests.dmpCheckFailedTitle"),
          err?.response?.data?.message || err?.message || t("common.somethingWentWrong"),
        );
      } finally {
        setCheckingId(null);
      }
    },
    [checkingId, refresh, t],
  );

  // Keep the list fresh whenever the tab regains focus (e.g. after paying).
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const { loadMore, loadingMore, hasMore } = usePaymentRequests();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) => r.shipmentTitle.toLowerCase().includes(q) || r.shortId.toLowerCase().includes(q),
    );
  }, [requests, search]);

  const handleLoadMore = () => {
    // Only load more if we are not actively searching
    if (!search.trim() && hasMore) {
      loadMore();
    }
  };

  const renderCard = ({ item }: { item: PaymentRequest }) => {
    const colors = STATUS_COLORS[item.status] ?? STATUS_COLORS.pending;
    const label = t(STATUS_LABEL_KEY[item.status] ?? STATUS_LABEL_KEY.pending);
    const payable = isPayable(item.status);
    return (
      <View style={s.card}>
        <View style={s.cardTop}>
          <Text style={s.shortId}>{item.shortId}</Text>
          <View style={[s.badge, { backgroundColor: colors.bg }]}>
            <Text style={[s.badgeTxt, { color: colors.fg }]}>{label}</Text>
          </View>
        </View>

        <Text style={s.title} numberOfLines={1}>{item.shipmentTitle}</Text>

        <View style={s.routeRow}>
          <MapPin size={14} color="#9CA3AF" />
          <Text style={s.route} numberOfLines={1}>
            {item.pickup} → {item.delivery}
          </Text>
        </View>

        <View style={s.cardBottom}>
          <Text style={s.amount}>{formatPrice(item.amount)}</Text>
          {payable ? (
            <TouchableOpacity style={s.payBtn} activeOpacity={0.85} onPress={() => setActive(item)}>
              <CreditCard size={16} color="#fff" />
              <Text style={s.payTxt}>{t("payment.requests.payNow")}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[s.statusNote, { color: colors.fg }]}>{label}</Text>
          )}
        </View>

        {item.status === "dmp_pending" && (
          <TouchableOpacity
            style={s.checkStatusBtn}
            activeOpacity={0.7}
            disabled={checkingId === item.id}
            onPress={() => handleCheckDmpStatus(item)}
          >
            {checkingId === item.id ? (
              <ActivityIndicator size="small" color={BLUE} />
            ) : (
              <RefreshCw size={13} color={BLUE} />
            )}
            <Text style={s.checkStatusTxt}>{t("payment.requests.dmpCheckStatus")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={s.screen}>
      <Text style={s.screenTitle}>{t("payment.requests.title")}</Text>

      {!loading && requests.length > 0 && (
        <View style={s.searchRow}>
          <View style={s.searchBox}>
            <Search size={16} color="#9ca3af" style={{ marginRight: 8 }} />
            <TextInput
              style={s.searchInput}
              placeholder={t("payment.requests.search")}
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </View>
        </View>
      )}

      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={BLUE} />
        </View>
      ) : requests.length === 0 ? (
        <View style={s.fullEmpty}>
          <View style={s.emptyIconWrap}>
            <ReceiptText size={34} color={BLUE} />
          </View>
          <Text style={s.emptyTitle}>{t("payment.requests.emptyTitle")}</Text>
          <Text style={s.emptySub}>{t("payment.requests.emptySubtitle")}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16, alignItems: "center" }}>
                <ActivityIndicator size="small" color={BLUE} />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[BLUE]} tintColor={BLUE} />
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <View style={s.emptyIconWrap}>
                <SearchX size={30} color={BLUE} />
              </View>
              <Text style={s.emptyTitle}>{t("payment.requests.noMatchTitle")}</Text>
              <Text style={s.emptySub}>{t("payment.requests.noMatchSubtitle", { query: search.trim() })}</Text>
            </View>
          }
        />
      )}

      <CompletePaymentModal visible={!!active} request={active} onClose={() => setActive(null)} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  screenTitle: { fontSize: 18, fontWeight: "800", color: "#111827", textAlign: "center", paddingVertical: 14 },

  searchRow: { paddingHorizontal: 16, marginBottom: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 46,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111827" },

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
  shortId: { fontSize: 13, fontWeight: "700", color: "#64748B" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeTxt: { fontSize: 11, fontWeight: "700" },

  title: { fontSize: 16, fontWeight: "700", color: "#111827", marginTop: 8 },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  route: { flex: 1, fontSize: 13, color: "#6B7280" },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  amount: { fontSize: 20, fontWeight: "800", color: BLUE },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: BLUE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  payTxt: { color: "#fff", fontWeight: "700", fontSize: 14 },
  statusNote: { fontSize: 13, fontWeight: "700" },
  checkStatusBtn: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10, alignSelf: "flex-start" },
  checkStatusTxt: { color: BLUE, fontWeight: "600", fontSize: 12.5 },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  fullEmpty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingBottom: 40 },
  empty: { paddingTop: 72, alignItems: "center", paddingHorizontal: 32 },
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
