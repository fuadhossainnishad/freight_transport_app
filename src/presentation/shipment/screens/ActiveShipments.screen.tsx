import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Map, Search } from "lucide-react-native";

import { ActiveShipmentsStackParamList } from "../../../navigation/types";
import { Shipment } from "../../../domain/entities/shipment.entity";
import { useAuth } from "../../../app/context/Auth.context";
import { getShipmentsUseCase } from "../../../domain/usecases/shipment.usecase";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 16 padding each side + 16 gap
const truckPlaceholder = require("../../../../assets/images/truck.png");

type NavProp = NativeStackNavigationProp<ActiveShipmentsStackParamList, "ActiveShipments">;

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS: Record<string, { label: string; bg: string; text: string }> = {
  IN_PROGRESS: { label: "In Progress", bg: "#FFF7ED", text: "#EA580C" },
  IN_TRANSIT:  { label: "In Transit",  bg: "#EFF6FF", text: "#1D4ED8" },
  COMPLETED:   { label: "Completed",   bg: "#F0FDF4", text: "#15803D" },
  PENDING:     { label: "Pending",     bg: "#F8FAFC", text: "#64748B" },
};

// ── Card ──────────────────────────────────────────────────────────────────────
function ShipmentCard({
  item,
  onPress,
  onMapPress,
}: {
  item: Shipment;
  onPress: () => void;
  onMapPress: () => void;
}) {
  const imageUri = item.images?.[0] ?? null;
  const status = STATUS[item.status] ?? { label: item.status, bg: "#F8FAFC", text: "#64748B" };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      {/* Orange active dot */}
      <View style={styles.activeDot} />

      {/* Image */}
      <View style={styles.imageBox}>
        <Image
          source={imageUri ? { uri: imageUri } : truckPlaceholder}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Info */}
      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardCategory} numberOfLines={1}>{item.category ?? ""}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
          </View>
        </View>

        {/* Map button */}
        <TouchableOpacity
          onPress={onMapPress}
          style={styles.mapBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Map size={16} color="#0071BC" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
const ActiveShipmentsScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filtered, setFiltered] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const role = user?.role.toLowerCase();
      const id = user?.role === "TRANSPORTER" ? user.transporter_id : user?.shipper_id;
      const { shipments: result } = await getShipmentsUseCase(role!, id!);
      setShipments(result);
      setFiltered(result);
    } catch (e) {
      console.error("Failed to load shipments:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(shipments);
    } else {
      const q = search.toLowerCase();
      setFiltered(shipments.filter((s) => s.title.toLowerCase().includes(q)));
    }
  }, [search, shipments]);

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Shipments</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <Search size={16} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search shipments…"
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      {/* Grid */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0071BC" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              colors={["#0071BC"]}
              tintColor="#0071BC"
            />
          }
          renderItem={({ item }) => (
            <ShipmentCard
              item={item}
              onPress={() => navigation.navigate("ActiveShipmentDetailsScreen", { shipmentId: item.id })}
              onMapPress={() => navigation.navigate("ShipmentDetails", { shipmentId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {search ? "No shipments match your search" : "No active shipments"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ActiveShipmentsScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  // search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  // list
  listContent: {
    padding: 16,
    paddingTop: 8,
    gap: 16,
  },
  row: {
    gap: 16,
  },

  // card
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  activeDot: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F97316",
    zIndex: 1,
  },
  imageBox: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.75,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: CARD_WIDTH - 12,
    height: CARD_WIDTH * 0.75 - 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 6,
    gap: 6,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  cardCategory: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  mapBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  // states
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
