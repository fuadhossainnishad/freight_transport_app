import { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, ActivityIndicator, TouchableOpacity,
  Image, Dimensions, ScrollView, FlatList,
  NativeScrollEvent, NativeSyntheticEvent, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../app/context/Auth.context";
import { TransporterHomeStackParamList } from "../../../navigation/types";
import { connectSocket, getSocket } from "../../../data/socket/socketClient";
import { getTransporterStats } from "../../../data/services/dashboardService";
import { getTransporterShipmentsUseCase } from "../../../domain/usecases/shipment.usecase";
import { Shipment } from "../../../domain/entities/shipment.entity";
import HomeHeader from "../../../shared/components/HomeHeader";
import StatCard from "../../../shared/components/StatCard";
import MapRoute from "../../shipment/components/MapRoute";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

type NavigationProp = NativeStackNavigationProp<TransporterHomeStackParamList, "Home">;

// ─── Image Carousel ───────────────────────────────────────────────────────────

function ShipmentImageCarousel({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % images.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH));
  };

  if (!images?.length) {
    return (
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>No images</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: CARD_WIDTH, height: 200 }}
            resizeMode="cover"
          />
        )}
      />
      {images.length > 1 && (
        <View style={styles.dotsRow}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: activeIndex === i ? 20 : 7,
                  backgroundColor: activeIndex === i ? "#f97316" : "#d1d5db",
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Detail Cell ──────────────────────────────────────────────────────────────

function DetailCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.detailCell}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[styles.detailValue, highlight && styles.detailHighlight]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Shipment Card ────────────────────────────────────────────────────────────

function ActiveShipmentCard({
  item,
  onPress,
}: {
  item: Shipment;
  onPress: () => void;
}) {
  return (
    <View style={styles.card}>

      {/* ① Images */}
      <ShipmentImageCarousel images={item.images} />

      {/* ② Title + Status */}
      <View style={styles.cardTitleRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === "IN_PROGRESS" ? "#fff7ed" : "#f0fdf4" },
        ]}>
          <View style={[
            styles.statusDot,
            { backgroundColor: item.status === "IN_PROGRESS" ? "#f97316" : "#22c55e" },
          ]} />
          <Text style={[
            styles.statusText,
            { color: item.status === "IN_PROGRESS" ? "#ea580c" : "#16a34a" },
          ]}>
            {item.status === "IN_PROGRESS" ? "In Progress" : "Delivered"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ③ Driver */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>DRIVER</Text>
        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Text style={{ fontSize: 20 }}>🧑‍✈️</Text>
          </View>
          <View>
            <Text style={styles.driverName}>
              {item.driverId ? "Assigned Driver" : "Not yet assigned"}
            </Text>
            <Text style={styles.driverSub}>
              {item.driverId
                ? `ID: ${item.driverId.slice(-6).toUpperCase()}`
                : "Pending assignment"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ④ Map */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ROUTE</Text>
        {/* {item.pickupCoords && item.deliveryCoords ? ( */}
        <MapRoute />
        {/* // ) : (
        //   <View style={styles.mapFallback}>
        //     <Text style={styles.mapFallbackText}>📍 Map loading when route is active</Text>
        //   </View>
        // )} */}
        <View style={styles.addressRow}>
          <View style={styles.addressItem}>
            <View style={[styles.addressDot, { backgroundColor: "#22c55e" }]} />
            <Text style={styles.addressText} numberOfLines={2}>{item.pickup}</Text>
          </View>
          <View style={styles.addressDividerV} />
          <View style={styles.addressItem}>
            <View style={[styles.addressDot, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.addressText} numberOfLines={2}>{item.delivery}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ⑤ Shipment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SHIPMENT DETAILS</Text>
        <View style={styles.detailsGrid}>
          <DetailCell label="Weight" value={item.weight} />
          <DetailCell label="Packaging" value={item.packaging} />
          <DetailCell label="Dimensions" value={item.dimensions} />
          <DetailCell label="Time Window" value={item.timeWindow} />
          <DetailCell label="Date" value={item.datePreference} />
          <DetailCell label="Price" value={`€${item.price}`} highlight />
        </View>
      </View>

      {/* ⑥ CTA */}
      <TouchableOpacity onPress={onPress} style={styles.ctaButton} activeOpacity={0.85}>
        <Text style={styles.ctaText}>See Full Details</Text>
        <Text style={styles.ctaArrow}>→</Text>
      </TouchableOpacity>

    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function TransporterHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user: authUser } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [activeShipments, setActiveShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!authUser?.transporter_id) return;
    try {
      const [statsRes, shipmentsRes] = await Promise.all([
        getTransporterStats(authUser.transporter_id),
        getTransporterShipmentsUseCase(authUser.transporter_id),
      ]);
      setStats(statsRes.data);
      setActiveShipments(shipmentsRes.shipments ?? []);
    } catch (error) {
      console.error("Home load error:", error);
    } finally {
      setLoading(false);
    }
  }, [authUser?.transporter_id]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const initSocket = async () => {
      const socket = await connectSocket();
      socket.on("connect", () => console.log("Socket connected"));
    };
    initSocket();
    return () => { getSocket()?.disconnect(); };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.screen}>
      <HomeHeader
        onpressLogo={() => navigation.navigate("Home")}
        onpressNotification={() => navigation.navigate("Home")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>

          {/* Stats */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <StatCard title="Shipments In Progress" value={stats?.shipmentsInProgress ?? 0} />
              <StatCard title="Completed Shipments" value={stats?.completedShipments ?? 0} />
            </View>
            <StatCard title="Total Earnings" value={`€${stats?.totalEarnings ?? 0}`} fullWidth />
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Active Shipments</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ActiveShipments")}>
              <Text style={styles.sectionHeaderLink}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Cards */}
          {activeShipments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No active shipments</Text>
            </View>
          ) : (
            <FlatList
              data={activeShipments}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              snapToInterval={CARD_WIDTH + 16}
              decelerationRate="fast"
              contentContainerStyle={{ gap: 16, paddingBottom: 8 }}
              renderItem={({ item }) => (
                <ActiveShipmentCard
                  item={item}
                  onPress={() =>
                    navigation.navigate("ShipmentDetails", { shipmentId: item.id })
                  }
                />
              )}
            />
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imagePlaceholder: {
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    height: 7,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: 12,
    color: "#6b7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 1,
    marginBottom: 10,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  driverAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff7ed",
    justifyContent: "center",
    alignItems: "center",
  },
  driverName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  driverSub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 1,
  },
  mapFallback: {
    height: 160,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  mapFallbackText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  addressRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  addressItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  addressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 3,
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: "#374151",
    lineHeight: 17,
  },
  addressDividerV: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 2,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  detailCell: {
    width: (CARD_WIDTH - 32 - 10) / 2,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
  },
  detailLabel: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  detailHighlight: {
    color: "#f97316",
    fontWeight: "700",
  },
  ctaButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f97316",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  ctaText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  ctaArrow: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  sectionHeaderLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f97316",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 14,
  },
});