import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ViewToken,
  Image,
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
import { ShipmentImageCarousel } from "../components/ShipmentImageCarousel";

const { width } = Dimensions.get("window");
// ─────────────────────────────
// CONSTANTS
// ─────────────────────────────
const GAP = 12;
const CARD_WIDTH = (width - 80) / 2;
const SNAP_INTERVAL = CARD_WIDTH + GAP;


type NavigationProp = NativeStackNavigationProp<
  TransporterHomeStackParamList,
  "Home"
>;

const MockImages = [
  { id: "1", uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  { id: "2", uri: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" },
  { id: "3", uri: "https://images.unsplash.com/photo-1522205408450-add114ad53fe" },
  { id: "4", uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  // { id: "5", uri: "https://images.unsplash.com/photo-1522205408450-add114ad53fe" },
  // { id: "6", uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
];

export default function TransporterHomeScreen2() {
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

  const viewVisibilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  }).current;

  // ─────────────────────────────
  // INFINITE SCROLL SETUP
  // ─────────────────────────────
  const CLONE_COUNT = 2; // clone 3 items from each end

  const infiniteImages = useMemo(() => [
    ...MockImages.slice(-CLONE_COUNT),   // tail clones at start
    ...MockImages,
    ...MockImages.slice(0, CLONE_COUNT), // head clones at end
  ], []);

  const REAL_OFFSET = CLONE_COUNT; // index where real data starts
  // ─────────────────────────────
  // REFS
  // ─────────────────────────────
  const flatListRef = useRef<FlatList>(null);
  const isJumping = useRef(false); // prevent onViewableItemsChanged during silent jump
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
  // ─────────────────────────────
  // VIEWABILITY
  // ─────────────────────────────
  const viewabilityConfig =
    useRef({
      itemVisiblePercentThreshold: 90,
    }).current;

  const lastFiredIndex = useRef(-1);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems?.length || isJumping.current) return;

      const visibleItem = viewableItems[0];
      const rawIndex = visibleItem?.index ?? 0;

      // ── deduplicate: skip if same index fired already ──
      if (rawIndex === lastFiredIndex.current) return;
      lastFiredIndex.current = rawIndex;

      const realIndex =
        ((rawIndex - CLONE_COUNT) % MockImages.length + MockImages.length) %
        MockImages.length;

      setActiveIndex(realIndex);
      console.log(`[Image In Focus] realIndex: ${realIndex} | id: ${MockImages[realIndex]?.id}`);

      const totalReal = MockImages.length;

      if (rawIndex < CLONE_COUNT) {
        isJumping.current = true;
        flatListRef.current?.scrollToIndex({
          index: rawIndex + totalReal,
          animated: false,
        });
        setTimeout(() => { isJumping.current = false; }, 50);

      } else if (rawIndex >= CLONE_COUNT + totalReal) {
        isJumping.current = true;
        flatListRef.current?.scrollToIndex({
          index: rawIndex - totalReal,
          animated: false,
        });
        setTimeout(() => { isJumping.current = false; }, 50);
      }
    },
    [] // ← stable, no deps
  );

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
          < FlatList
            ref={flatListRef}
            data={infiniteImages}
            extraData={activeIndex}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            initialScrollIndex={CLONE_COUNT}           // start at first real item
            getItemLayout={(_, index) => ({            // required for scrollToIndex + initialScrollIndex
              length: SNAP_INTERVAL,
              offset: SNAP_INTERVAL * index,
              index,
            })}
            contentContainerStyle={{
              gap: GAP,
              paddingVertical: 8,
            }}
            renderItem={({ item, index }) => {
              const realIndex = ((index - REAL_OFFSET) % MockImages.length + MockImages.length) % MockImages.length;
              const isActive = activeIndex === realIndex;

              return (
                <View
                  style={{
                    width: CARD_WIDTH,
                    height: 150,
                    justifyContent: "flex-end",
                  }}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={{
                      width: CARD_WIDTH,
                      height: isActive ? 150 : 130,
                      borderRadius: 12,
                      opacity: isActive ? 1 : 0.6,
                    }}
                    resizeMode="cover"
                  />
                </View>
              );
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        )}

        {/* ───── ACTIVE DETAILS ───── */}
        {/* {activeShipment && (
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
        )} */}
      </View>
    </SafeAreaView>
  );
}