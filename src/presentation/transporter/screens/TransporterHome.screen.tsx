import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
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

const truckPlaceholder = require("../../../../assets/images/truck.png");

// ─────────────────────────────
// CAROUSEL ITEM
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
  const imageUri = item.images?.[0] ?? null;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={{
          width: CARD_WIDTH,
          backgroundColor: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          opacity: isActive ? 1 : 0.6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Active dot indicator */}
        {isActive && (
          <View
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#f97316",
              zIndex: 1,
            }}
          />
        )}

        {/* Image */}
        <Image
          source={imageUri ? { uri: imageUri } : truckPlaceholder}
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT_ACTIVE,
            backgroundColor: "#f3f4f6",
          }}
          resizeMode="cover"
        />

        {/* Title + category */}
        <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
          <Text
            numberOfLines={1}
            style={{ fontSize: 13, fontWeight: "700", color: "#111827" }}
          >
            {item.title ?? "Shipment"}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}
          >
            {item.category ?? ""}
          </Text>
        </View>
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
  const [activeIndex, setActiveIndex] = useState(0);

  // ─────────────────────────────
  // REFS
  // ─────────────────────────────
  const flatListRef = useRef<FlatList>(null);
  const isJumping = useRef(false);
  const lastFiredIndex = useRef(-1);
  const activeShipmentsRef = useRef<Shipment[]>([]);

  const { data, status, error, refresh } = useTransporterStats(authUser?.transporter_id!)
  const { data: activeShipmentsData, status: activeShipmentsStatus, error: activeShipmentsError, refresh: activeShipmentsRefresh } = useActiveShipments(authUser?.transporter_id!)

  const activeShipments: Shipment[] = activeShipmentsData ?? [];

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
    [] // activeShipments accessed via ref — no stale closure, no dep needed
  );

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
            data={infiniteShipments}
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
            onMomentumScrollEnd={() => { isJumping.current = false; }}
            onScrollEndDrag={() => { isJumping.current = false; }}
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

      </View>
    </SafeAreaView>
  );
}