import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAuth } from "../../../app/context/Auth.context";
import useTransporterStats from "../hooks/useTransporterStats";
import useActiveShipments from "../hooks/useActiveShipments";
import useTransporterSocket from "../hooks/useTransporterSocket";

import { TransporterHomeStackParamList } from "../../../navigation/types";

import { Shipment } from "../../../domain/entities/shipment.entity";
import HomeHeader from "../../../shared/components/HomeHeader";
import TransporterStatsSection from "../components/TransporterStatsSection";
import { ShipmentsCarousel } from "../components/ShipmentsCarousel";
import { ActiveShipmentDetail } from "../components/ActiveShipmentDetail";
import useDriverMap from "../hooks/useDriverMap";



type NavigationProp = NativeStackNavigationProp<
  TransporterHomeStackParamList,
  "Home"
>;

export default function TransporterHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user: authUser } = useAuth();
  const transporterId = authUser?.transporter_id;

  // ─────────────────────────────
  // HOOKS
  // ─────────────────────────────
  useTransporterSocket();  // ← self-contained, no return value needed

  const stats = useTransporterStats(transporterId);
  const shipments = useActiveShipments(transporterId);
  const { driversMap, fetchDriver } = useDriverMap();

  const activeShipments = shipments.data ?? [];

  // ─────────────────────────────
  // FOCUSED SHIPMENT STATE
  // ─────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusedShipment, setFocusedShipment] = useState<Shipment | null>(null);

  const activeDriver = driversMap[focusedShipment?.driverId ?? ""] ?? null;

  // called by carousel when a shipment scrolls into focus
  const handleShipmentFocus = (shipment: Shipment) => {
    setFocusedShipment(shipment);
    if (shipment.driverId) {
      fetchDriver(shipment.driverId); // ← lazy, cached, only on focus
    }
  };

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

        <TransporterStatsSection
          data={stats.data}
          status={stats.status}
          error={stats.error}
          onRetry={stats.refresh}
        />

        <View className="flex-row justify-between items-center mt-6 mb-3">
          <Text className="text-base font-bold text-gray-900">Active Shipments</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ActiveShipments")}>
            <Text className="text-sm font-semibold text-black">See All</Text>
          </TouchableOpacity>
        </View>

        {activeShipments.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-gray-400 text-sm">No active shipments</Text>
          </View>
        ) : (
          <ShipmentsCarousel
            shipments={activeShipments}
            onShipmentFocus={handleShipmentFocus}
            onActiveIndexChange={setActiveIndex}
          />
        )}

        {focusedShipment && (
          <ActiveShipmentDetail
            shipment={focusedShipment}
            driver={activeDriver}
          />
        )}

      </View>
    </SafeAreaView>
  );
}