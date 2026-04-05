import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAuth } from "../../../app/context/Auth.context";
import { TransporterHomeStackParamList } from "../../../navigation/types";
import { connectSocket, getSocket } from "../../../data/socket/socketClient";
import { getTransporterShipmentsUseCase } from "../../../domain/usecases/shipment.usecase";
import { getDriverByIdsUseCase } from "../../../domain/usecases/driver.usecase";
import { Shipment } from "../../../domain/entities/shipment.entity";

import HomeHeader from "../../../shared/components/HomeHeader";
import useTransporterStats from "../hooks/useTransporterStats";
import TransporterStatsSection from "../components/TransporterStatsSection";
import useActiveShipments from "../hooks/useActiveShipments";

// ─────────────────────────────
// CONSTANTS
// ─────────────────────────────
const { width } = Dimensions.get("window");
const GAP = 12;
const CLONE_COUNT = 2;
const CARD_WIDTH = (width - 80) / 2;
const CARD_HEIGHT_ACTIVE = CARD_WIDTH;
const CARD_HEIGHT_INACTIVE = CARD_WIDTH - 24;
const SNAP_INTERVAL = CARD_WIDTH + GAP;

type NavigationProp = NativeStackNavigationProp<
  TransporterHomeStackParamList,
  "Home"
>;

// ─────────────────────────────
// CAROUSEL ITEM — isolated so it never re-renders unless its own props change
// ─────────────────────────────
const ShipmentCarouselItem = ({
  item,
  isActive,
  onPress,
}: {
  item: Shipment;
  isActive: boolean;
  onPress: () => void;
}) => {
  const imageUri = item.images ?? item.images ?? null;
  const height = isActive ? CARD_HEIGHT_ACTIVE : CARD_HEIGHT_INACTIVE;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT_ACTIVE, // container always full height
          justifyContent: "flex-end", // card grows upward from bottom
        }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: CARD_WIDTH,
              height,
              borderRadius: 12,
              opacity: isActive ? 1 : 0.55,
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: CARD_WIDTH,
              height,
              borderRadius: 12,
              opacity: isActive ? 1 : 0.55,
              backgroundColor: "#e5e7eb",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 11, color: "#9ca3af" }}>No image</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────
// MAIN SCREEN
// ─────────────────────────────
export default function TransporterHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user: authUser } = useAuth();

  // ─────────────────────────────
  // STATE
  // ─────────────────────────────
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [driversMap, setDriversMap] = useState<Record<string, any>>({});

  // ─────────────────────────────
  // REFS
  // ─────────────────────────────
  const flatListRef = useRef<FlatList>(null);
  const driverCacheRef = useRef(new Map<string, any>());
  const isJumping = useRef(false);
  const lastFiredIndex = useRef(-1);

  // keep a stable ref to activeShipments so the useCallback below
  // never goes stale without needing activeShipments in its deps
  const activeShipmentsRef = useRef<Shipment[]>([]);

  const { data, status, error, refresh } = useTransporterStats(authUser?.transporter_id!)
  const { data: activeShipmentsData, status: activeShipmentsStatus, error: activeShipmentsError, refresh: activeShipmentsRefresh } = useActiveShipments(authUser?.transporter_id!)

  useEffect(() => {
    activeShipmentsRef.current = activeShipments;
  }, [activeShipments]);

  // ─────────────────────────────
  // INFINITE LIST
  // ─────────────────────────────
  const infiniteShipments = useMemo(() => {
    if (activeShipments.length === 0) return [];
    return [
      ...activeShipments.slice(-CLONE_COUNT),
      ...activeShipments,
      ...activeShipments.slice(0, CLONE_COUNT),
    ];
  }, [activeShipments]);

  // ─────────────────────────────
  // DATA LOAD — fetch all shipments on mount
  // ─────────────────────────────
  // const loadData = useCallback(async () => {
  //   if (!authUser?.transporter_id) return;

  //   try {
  //     const shipmentsRes = await getTransporterShipmentsUseCase(authUser.transporter_id);

  //     setActiveShipments(shipmentsRes.shipments ?? []);
  //   } catch (error) {
  //     console.error("Home load error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [authUser?.transporter_id]);

  // useEffect(() => {
  //   loadData();
  // }, [loadData]);

  // ─────────────────────────────
  // SOCKET
  // ─────────────────────────────
  useEffect(() => {
    const initSocket = async () => {
      const socket = await connectSocket();
      socket.on("connect", () => console.log("Socket connected"));
    };

    initSocket();
    return () => { getSocket()?.disconnect(); };
  }, []);

  // ─────────────────────────────
  // DRIVER FETCH — lazy, cached, only fires on focus
  // ─────────────────────────────
  const fetchDriver = useCallback(async (driverId: string) => {
    if (!driverId) return;
    if (driverCacheRef.current.has(driverId)) return; // already in cache, skip

    try {
      const driver = await getDriverByIdsUseCase(driverId);
      driverCacheRef.current.set(driverId, driver);
      setDriversMap((prev) => ({ ...prev, [driverId]: driver }));
    } catch (e) {
      console.error("Driver fetch failed:", e);
    }
  }, []);

  // ─────────────────────────────
  // VIEWABILITY CONFIG
  // ─────────────────────────────
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 90,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems?.length || isJumping.current) return;

      const rawIndex = viewableItems[0]?.index ?? 0;

      // deduplicate — FlatList fires on enter AND settle
      if (rawIndex === lastFiredIndex.current) return;
      lastFiredIndex.current = rawIndex;

      const shipments = activeShipmentsRef.current; // stable ref, no stale closure
      const totalReal = shipments.length;
      if (totalReal === 0) return;

      // strip clone offset to get real index
      const realIndex = ((rawIndex - CLONE_COUNT) % totalReal + totalReal) % totalReal;
      setActiveIndex(realIndex);

      // ── lazy driver fetch only when this shipment comes into focus ──
      const focusedShipment = shipments[realIndex];
      if (focusedShipment?.driverId) {
        fetchDriver(focusedShipment.driverId);
      }

      // silent jump when entering clone zone
      if (rawIndex < CLONE_COUNT) {
        isJumping.current = true;
        flatListRef.current?.scrollToIndex({ index: rawIndex + totalReal, animated: false });
        setTimeout(() => { isJumping.current = false; }, 50);

      } else if (rawIndex >= CLONE_COUNT + totalReal) {
        isJumping.current = true;
        flatListRef.current?.scrollToIndex({ index: rawIndex - totalReal, animated: false });
        setTimeout(() => { isJumping.current = false; }, 50);
      }
    },
    [fetchDriver] // activeShipments accessed via ref — no stale closure, no dep needed
  );

  // ─────────────────────────────
  // ACTIVE DATA DERIVATION
  // ─────────────────────────────
  const activeShipment = activeShipments[activeIndex];
  const activeDriver = driversMap[activeShipment?.driverId ?? ""] ?? null;

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
        <TransporterStatsSection
          data={data}
          status={status}
          error={error}
          onRetry={refresh}
        />

        {/* ───── SECTION HEADER ───── */}
        <View className="flex-row justify-between items-center mt-6 mb-3">
          <Text className="text-base font-bold text-gray-900">
            Active Shipments
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("ActiveShipments")}>
            <Text className="text-sm font-semibold text-black">See All</Text>
          </TouchableOpacity>
        </View>

        {/* ───── CAROUSEL ───── */}
        {activeShipments.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-gray-400 text-sm">No active shipments</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={activeShipmentsData}
            extraData={activeIndex}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            initialScrollIndex={CLONE_COUNT}
            getItemLayout={(_, index) => ({
              length: SNAP_INTERVAL,
              offset: SNAP_INTERVAL * index,
              index,
            })}
            contentContainerStyle={{ gap: GAP, paddingVertical: 8 }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item, index }) => {
              const totalReal = activeShipments.length;
              const realIndex = ((index - CLONE_COUNT) % totalReal + totalReal) % totalReal;
              const isActive = activeIndex === realIndex;

              return (
                <ShipmentCarouselItem
                  item={item}
                  isActive={isActive}
                  onPress={() =>
                    navigation.navigate("ShipmentDetails", { shipmentId: item.id })
                  }
                />
              );
            }}
          />
        )}

        {/* ───── FOCUSED SHIPMENT DETAIL ───── */}
        {activeShipment && (
          <View className="mt-4 p-4 bg-white rounded-xl shadow-sm">
            <Text className="text-lg font-bold text-gray-900">
              {activeShipment.title}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Status: {activeShipment.status}
            </Text>

            <View className="mt-3">
              <Text className="text-sm font-semibold text-gray-800">Driver</Text>
              {activeShipment.driverId ? (
                activeDriver ? (
                  <>
                    <Text className="text-sm text-gray-500 mt-1">{activeDriver.name}</Text>
                    <Text className="text-sm text-gray-500">{activeDriver.phone ?? ""}</Text>
                  </>
                ) : (
                  <Text className="text-sm text-gray-400 mt-1">Loading driver...</Text>
                )
              ) : (
                <Text className="text-sm text-gray-400 mt-1">No driver assigned</Text>
              )}
            </View>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}