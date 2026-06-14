import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Eye, Map, Plus, Search } from "lucide-react-native";

import { ActiveShipmentsStackParamList } from "../../../navigation/types";
import { Shipment } from "../../../domain/entities/shipment.entity";
import { useAuth } from "../../../app/context/Auth.context";
import { getShipmentsUseCase } from "../../../domain/usecases/shipment.usecase";

const BLUE = "#036BB4";

type NavProp = NativeStackNavigationProp<ActiveShipmentsStackParamList, "ActiveShipments">;

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  IN_PROGRESS: { label: "In progress", bg: "#F97316", text: "#fff", dot: "#fff" },
  IN_TRANSIT:  { label: "In transit",  bg: "#2563EB", text: "#fff", dot: "#fff" },
  COMPLETED:   { label: "Delivered",   bg: "#22C55E", text: "#fff", dot: "#fff" },
  DELIVERED:   { label: "Delivered",   bg: "#22C55E", text: "#fff", dot: "#fff" },
  BIDDING:     { label: "Bidding",     bg: "#0EA5E9", text: "#fff", dot: "#fff" },
  PENDING:     { label: "Pending",     bg: "#64748B", text: "#fff", dot: "#fff" },
  CANCELLED:   { label: "Cancelled",   bg: "#EF4444", text: "#fff", dot: "#fff" },
};

const MyShipmentsScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    try {
      const { shipments: result } = await getShipmentsUseCase("shipper", user?.shipper_id!);
      setShipments(result);
    } catch (e) {
      console.error("Failed to load shipments:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.shipper_id]);

  // Loads on mount and refetches whenever the tab regains focus
  // (e.g. after creating a shipment).
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = search.trim()
    ? shipments.filter((s) => s.title?.toLowerCase().includes(search.toLowerCase()))
    : shipments;

  const renderRow = ({ item }: { item: Shipment }) => {
    const status = STATUS[item.status] ?? { label: item.status, bg: "#64748B", text: "#fff", dot: "#fff" };
    return (
      <View style={s.row}>
        <Text style={[s.cell, s.titleCell]} numberOfLines={1}>{item.title}</Text>

        <View style={[s.cell, s.statusCell]}>
          <View style={[s.badge, { backgroundColor: status.bg }]}>
            <View style={[s.dot, { backgroundColor: status.dot }]} />
            <Text style={[s.badgeTxt, { color: status.text }]} numberOfLines={1}>{status.label}</Text>
          </View>
        </View>

        <View style={[s.cell, s.actionCell]}>
          <TouchableOpacity
            style={s.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => navigation.navigate("ShipperShipmentDetail", { shipmentId: item.id })}
          >
            <Eye size={18} color="#7C3AED" />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => navigation.navigate("ShipmentTracking", { shipmentId: item.id })}
          >
            <Map size={18} color={BLUE} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={s.screen}>
      <Text style={s.screenTitle}>My Shipments</Text>

      {/* Search */}
      <View style={s.searchRow}>
        <View style={s.searchBox}>
          <Search size={16} color="#9ca3af" style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Search"
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={BLUE} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderRow}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={[BLUE]} tintColor={BLUE} />
          }
          ListHeaderComponent={
            <View style={s.thead}>
              <Text style={[s.theadTxt, s.titleCell]}>Shipment title</Text>
              <Text style={[s.theadTxt, s.statusCell, { textAlign: "center" }]}>Status</Text>
              <Text style={[s.theadTxt, s.actionCell, { textAlign: "center" }]}>Action</Text>
            </View>
          }
          stickyHeaderIndices={[0]}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyText}>
                {search ? "No shipments match your search" : "No shipments yet"}
              </Text>
            </View>
          }
        />
      )}

      {/* Create shipment */}
      <View style={s.footer}>
        <TouchableOpacity
          style={s.createBtn}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("CreateShipment")}
        >
          <Plus size={20} color="#fff" />
          <Text style={s.createTxt}>Create Shipment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyShipmentsScreen;

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  screenTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    paddingVertical: 14,
  },

  // search
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

  // table head
  thead: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BLUE,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  theadTxt: { color: "#fff", fontSize: 13, fontWeight: "700" },

  // rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#F1F5F9",
  },
  cell: { justifyContent: "center" },
  titleCell: { flex: 1.3 },
  statusCell: { flex: 1.2, alignItems: "center" },
  actionCell: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 14 },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  badgeTxt: { fontSize: 11, fontWeight: "700" },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },

  // states
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { paddingTop: 60, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#9CA3AF" },

  // footer
  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: "#fff",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: BLUE,
    borderRadius: 30,
    paddingVertical: 15,
  },
  createTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
