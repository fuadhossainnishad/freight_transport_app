import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ViewToken,
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
import ActiveShipmentCard from "../components/ActiveShipmentCard";
import { getDriverByIdsUseCase } from "../../../domain/usecases/driver.usecase";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

type NavigationProp = NativeStackNavigationProp<
  TransporterHomeStackParamList,
  "Home"
>;

export default function TransporterHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user: authUser } = useAuth();

  // ─────────────────────────────
  // STATE
  // ─────────────────────────────
  const [stats, setStats] = useState<any>(null);
  const [activeShipments, setActiveShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [driversMap, setDriversMap] = useState<Record<string, any>>({});

  // ─────────────────────────────
  // DRIVER CACHE REF (avoid rerenders)
  // ─────────────────────────────
  const driverCacheRef = useRef(new Map<string, any>());

  // ─────────────────────────────
  // DATA LOAD
  // ─────────────────────────────
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

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─────────────────────────────
  // SOCKET
  // ─────────────────────────────
  useEffect(() => {
    const initSocket = async () => {
      const socket = await connectSocket();
      socket.on("connect", () => console.log("Socket connected"));
    };

    initSocket();

    return () => {
      getSocket()?.disconnect();
    };
  }, []);

  // ─────────────────────────────
  // DRIVER FETCH (CACHED + SAFE)
  // ─────────────────────────────
  const fetchDriver = useCallback(async (driverId: string) => {
    if (!driverId) return;

    // 1. check memory cache
    if (driverCacheRef.current.has(driverId)) {
      return driverCacheRef.current.get(driverId);
    }

    try {
      const driver = await getDriverByIdsUseCase(driverId);

      driverCacheRef.current.set(driverId, driver);

      setDriversMap((prev) => ({
        ...prev,
        [driverId]: driver,
      }));

      return driver;
    } catch (e) {
      console.log("Driver fetch failed:", e);
    }
  }, []);

  // ─────────────────────────────
  // VIEWABILITY CONFIG
  // ─────────────────────────────
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems?.length) return;

      const item = viewableItems[0]?.item as Shipment;
      const index = viewableItems[0]?.index ?? 0;

      setActiveIndex(index);

      // trigger lazy driver fetch
      if (item?.driverId) {
        fetchDriver(item.driverId);
      }
    }
  ).current;

  // ─────────────────────────────
  // ACTIVE DATA DERIVATION
  // ─────────────────────────────
  const activeShipment = activeShipments[activeIndex];
  const activeDriver =
    driversMap[activeShipment?.driverId ?? ""] || null;

  // ─────────────────────────────
  // LOADING UI
  // ─────────────────────────────
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </SafeAreaView>
    );
  }

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <HomeHeader
        onpressLogo={() => navigation.navigate("Home")}
        onpressNotification={() => navigation.navigate("Home")}
      />

      <View className="px-5 mt-4">

        {/* ───── STATS ───── */}
        <View className="gap-3">
          <View className="flex-row gap-3">
            <StatCard
              title="Shipments In Progress"
              value={stats?.shipmentsInProgress ?? 0}
            />
            <StatCard
              title="Completed Shipments"
              value={stats?.completedShipments ?? 0}
            />
          </View>

          <StatCard
            title="Total Earnings"
            value={`€${stats?.totalEarnings ?? 0}`}
            fullWidth
          />
        </View>

        {/* ───── HEADER ───── */}
        <View className="flex-row justify-between items-center mt-6 mb-3">
          <Text className="text-base font-bold text-gray-900">
            Active Shipments
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("ActiveShipments")}
          >
            <Text className="text-sm font-semibold text-black">
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {/* ───── CAROUSEL ───── */}
        {activeShipments.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-gray-400 text-sm">
              No active shipments
            </Text>
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
                  navigation.navigate("ShipmentDetails", {
                    shipmentId: item.id,
                  })
                }
              />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        )}

        {/* ───── ACTIVE DETAILS ───── */}
        {activeShipment && (
          <View className="mt-4 p-4 bg-white rounded-xl shadow-sm">
            <Text className="text-lg font-bold text-gray-900">
              {activeShipment.title}
            </Text>

            <Text className="text-sm text-gray-500 mt-1">
              Status: {activeShipment.status}
            </Text>

            <View className="mt-3">
              <Text className="text-sm font-semibold text-gray-800">
                Driver
              </Text>

              <Text className="text-sm text-gray-500 mt-1">
                {activeDriver
                  ? activeDriver.name
                  : "Loading driver..."}
              </Text>

              <Text className="text-sm text-gray-500">
                {activeDriver?.phone ?? ""}
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}