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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Search, SearchX, ReceiptText, MapPin, CreditCard } from "lucide-react-native";

import { usePaymentRequests } from "../PaymentRequestsContext";
import { PaymentRequest, PaymentRequestStatus, isPayable } from "../../../domain/entities/paymentRequest.entity";
import CompletePaymentModal from "../components/CompletePaymentModal";

const BLUE = "#036BB4";

const STATUS: Record<PaymentRequestStatus, { label: string; bg: string; fg: string }> = {
  pending:           { label: "Pending",     bg: "#FEF3C7", fg: "#B45309" },
  online_processing: { label: "Processing",  bg: "#DBEAFE", fg: "#1D4ED8" },
  cash_pending:      { label: "Cash pending", bg: "#FEF3C7", fg: "#B45309" },
  bank_pending:      { label: "Bank pending", bg: "#FEF3C7", fg: "#B45309" },
  completed:         { label: "Paid",        bg: "#DCFCE7", fg: "#15803D" },
  verified:          { label: "Verified",    bg: "#DCFCE7", fg: "#15803D" },
  rejected:          { label: "Rejected",    bg: "#FEE2E2", fg: "#B91C1C" },
  cancelled:         { label: "Cancelled",   bg: "#F1F5F9", fg: "#64748B" },
};

export default function PaymentRequestsScreen() {
  const { requests, loading, refresh } = usePaymentRequests();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState<PaymentRequest | null>(null);

  // Keep the list fresh whenever the tab regains focus (e.g. after paying).
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) => r.shipmentTitle.toLowerCase().includes(q) || r.shortId.toLowerCase().includes(q),
    );
  }, [requests, search]);

  const renderCard = ({ item }: { item: PaymentRequest }) => {
    const st = STATUS[item.status] ?? STATUS.pending;
    const payable = isPayable(item.status);
    return (
      <View style={s.card}>
        <View style={s.cardTop}>
          <Text style={s.shortId}>{item.shortId}</Text>
          <View style={[s.badge, { backgroundColor: st.bg }]}>
            <Text style={[s.badgeTxt, { color: st.fg }]}>{st.label}</Text>
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
          <Text style={s.amount}>${item.amount.toLocaleString()}</Text>
          {payable ? (
            <TouchableOpacity style={s.payBtn} activeOpacity={0.85} onPress={() => setActive(item)}>
              <CreditCard size={16} color="#fff" />
              <Text style={s.payTxt}>Pay Now</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[s.statusNote, { color: st.fg }]}>{st.label}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={s.screen}>
      <Text style={s.screenTitle}>Payment Requests</Text>

      {!loading && requests.length > 0 && (
        <View style={s.searchRow}>
          <View style={s.searchBox}>
            <Search size={16} color="#9ca3af" style={{ marginRight: 8 }} />
            <TextInput
              style={s.searchInput}
              placeholder="Search by shipment title or ID"
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
          <Text style={s.emptyTitle}>No payment requests</Text>
          <Text style={s.emptySub}>
            When an admin requests a payment for one of your shipments, it'll show up here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[BLUE]} tintColor={BLUE} />
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <View style={s.emptyIconWrap}>
                <SearchX size={30} color={BLUE} />
              </View>
              <Text style={s.emptyTitle}>No matching requests</Text>
              <Text style={s.emptySub}>{`We couldn't find a request matching "${search.trim()}".`}</Text>
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
