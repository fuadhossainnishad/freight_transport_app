import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Truck, ArrowRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAuth } from "../../../app/context/Auth.context";
import useTransporterStats from "../hooks/useTransporterStats";
import useActiveShipments from "../hooks/useActiveShipments";
import useTransporterSocket from "../hooks/useTransporterSocket";
import useDriverMap from "../hooks/useDriverMap";

import { TransporterHomeStackParamList } from "../../../navigation/types";
import { Shipment } from "../../../domain/entities/shipment.entity";

import HomeHeader from "../../../shared/components/HomeHeader";
import TransporterStatsSection from "../components/TransporterStatsSection";
import { ShipmentsCarousel } from "../components/ShipmentsCarousel";
import { ActiveShipmentDetail } from "../components/ActiveShipmentDetail";

type NavigationProp = NativeStackNavigationProp<
  TransporterHomeStackParamList,
  "Home"
>;

export default function TransporterHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user: authUser } = useAuth();
  const transporterId = authUser?.transporter_id;

  useTransporterSocket();

  const stats = useTransporterStats(transporterId);
  const shipments = useActiveShipments(transporterId);
  const { driversMap, fetchDriver } = useDriverMap();

  const activeShipments = shipments.data ?? [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [focusedShipment, setFocusedShipment] = useState<Shipment | null>(null);

  // undefined = not yet fetched, null = fetched but not found, Driver = loaded
  const activeDriver = focusedShipment?.driverId
    ? driversMap[focusedShipment.driverId]
    : null;

  const handleShipmentFocus = (shipment: Shipment) => {
    setFocusedShipment(shipment);
    if (shipment.driverId) {
      fetchDriver(shipment.driverId);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-gray-50">
      <HomeHeader
        onpressLogo={() => navigation.navigate("Home")}
        onpressNotification={() => navigation.navigate("Home")}
      />

      <ScrollView
        className="flex-1 px-5 mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <TransporterStatsSection
          data={stats.data}
          status={stats.status}
          error={stats.error}
          onRetry={stats.refresh}
        />

        {/* Active Shipments header */}
        <View className="flex-row justify-between items-center mt-6 mb-3">
          <Text className="text-lg font-bold text-gray-900">
            Active Shipments
          </Text>
          {activeShipments.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("ActiveShipments")}
            >
              <Text className="text-sm font-semibold text-[#036BB4]">
                See All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Carousel */}
        {activeShipments.length === 0 ? (
          <View
            className="bg-white rounded-2xl border border-gray-100 items-center px-6 py-10"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 1,
            }}
          >
            <View className="w-[72px] h-[72px] rounded-full bg-blue-50 items-center justify-center mb-5">
              <Truck size={32} color="#036BB4" strokeWidth={1.75} />
            </View>
            <Text className="text-base font-bold text-gray-900 mb-1.5">
              No active shipments yet
            </Text>
            <Text className="text-sm text-gray-500 text-center leading-[20px] mb-6 max-w-[280px]">
              Once you win a bid, your live shipments show up here. Browse
              available loads to start hauling and grow your earnings.
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                (navigation.getParent() as any)?.navigate("AvailableBids")
              }
              className="flex-row items-center justify-center bg-[#036BB4] rounded-xl px-6 py-3.5 w-full"
            >
              <Text className="text-white font-semibold text-sm mr-2">
                Browse Available Bids
              </Text>
              <ArrowRight size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <ShipmentsCarousel
            shipments={activeShipments}
            onShipmentFocus={handleShipmentFocus}
            onActiveIndexChange={setActiveIndex}
          />
        )}

        {/* Driver details + map — shown when a shipment is focused */}
        {focusedShipment && (
          <ActiveShipmentDetail
            shipment={focusedShipment}
            driver={activeDriver}
            onViewDetails={() =>
              navigation.navigate("ShipmentDetails", { shipmentId: focusedShipment.id })
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
