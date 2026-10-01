import ShipmentDetailSkeleton from "../../../shared/components/ShipmentDetailSkeleton";
import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoSection from "../components/InfoSection";
import InfoRow from "../components/InfoRow";
import { Package } from "lucide-react-native";
import { getShipmentDetailsUseCase } from "../../../domain/usecases/shipment.usecase";
import { RouteProp, useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { AvailableBidsStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AppHeader from "../../../shared/components/AppHeader";
import { getShipmentBids } from "../../../data/services/shipmentService";
import ShipmentBidsList from "../components/ShipmentBidsList";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import { useShipmentOptions } from "../../../shared/i18n/useShipmentOptions";

import ArrowIcon from "../../../../assets/icons/arrow4.svg"

const { width } = Dimensions.get("window");


// Status values mirror the backend ShipmentStatus enum
// (Shipment/shipment.type.ts): PENDING, BIDDING, IN_PROGRESS,
// IN_TRANSIT, COMPLETED, CANCELLED.
const STATUS_CONFIG: Record<string, { labelKey: ParseKeys; bg: string }> = {
    PENDING: { labelKey: "availableBids.shipmentDetails.status.pending", bg: "#64748B" },
    BIDDING: { labelKey: "availableBids.shipmentDetails.status.bidding", bg: "#0EA5E9" },
    IN_PROGRESS: { labelKey: "availableBids.shipmentDetails.status.inProgress", bg: "#F97316" },
    IN_TRANSIT: { labelKey: "availableBids.shipmentDetails.status.inTransit", bg: "#8B5CF6" },
    COMPLETED: { labelKey: "availableBids.shipmentDetails.status.completed", bg: "#22C55E" },
    CANCELLED: { labelKey: "availableBids.shipmentDetails.status.cancelled", bg: "#EF4444" },
};

type RoutePropType = RouteProp<AvailableBidsStackParamList, 'ShipmentDetails'>;
type NavigationPropType = NativeStackNavigationProp<AvailableBidsStackParamList, 'ShipmentDetails'>;

export default function ShipmentDetailsScreen() {
    const { t } = useTranslation();
    const { categoryLabel } = useShipmentOptions();
    const navigation = useNavigation<NavigationPropType>();
    const route = useRoute<RoutePropType>();
    const { shipmentId } = route.params;

    const [shipmentData, setShipmentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bidCount, setBidCount] = useState(0);

    const [viewMode, setViewMode] = useState<"details" | "bids">("details");


    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getShipmentDetailsUseCase(shipmentId);
            // console.log("Fetched shipment:", res);
            setShipmentData(res);
        } catch (err) {
            // console.error("Error fetching shipment details:", err);
        } finally {
            setLoading(false);
        }
    }, [shipmentId]);

    const fetchBidCount = useCallback(async () => {
        try {
            const bids = await getShipmentBids(shipmentId);
            setBidCount(bids.length);
        } catch (error) {
            // console.log("Bid count error:", error);
        }
    }, [shipmentId]);

    useFocusEffect(
        useCallback(() => {
            fetchDetails();
            fetchBidCount();
        }, [fetchDetails, fetchBidCount])
    );


    if (loading) {
        return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <AppHeader text={t("availableBids.shipmentDetails.title")} onpress={() => navigation.goBack()} />
            <ShipmentDetailSkeleton />
        </SafeAreaView>
    );
    }

    if (!shipmentData) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text className="text-gray-500">{t("availableBids.shipmentDetails.notAvailable")}</Text>
            </SafeAreaView>
        );
    }

    const {
        title,
        description,
        category,
        weight,
        dimensions,
        packaging,
        images,
        pickup,
        delivery,
        timeWindow,
        datePreference,
        price,
        driver,
        vehicle,
        status,
    } = shipmentData;

    // Bidding is only open while the shipment is in the BIDDING stage.
    // Outside of it, transporters should see no bid UI (place your bid / bid list).
    const isBidding = status === "BIDDING";
    const statusConfig = STATUS_CONFIG[status];
    const statusInfo = {
        label: statusConfig ? t(statusConfig.labelKey) : status ?? t("availableBids.shipmentDetails.status.unknown"),
        bg: statusConfig?.bg ?? "#64748B",
    };

    return (
        <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
            <AppHeader text={t("availableBids.shipmentDetails.title")} onpress={() => navigation.goBack()} />
            {/* 🔹 Image Carousel */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 px-4"
                contentContainerStyle={{ paddingBottom: 24 }}>
                {images && images.length > 0 ? (
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    >
                        {images.map((item: string, i: number) => (
                            <Image
                                key={i}
                                source={{ uri: item }}
                                style={{ width: width - 32, height: 200 }}
                                className="rounded-xl"
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <View
                        style={{ width: width - 32, height: 200, backgroundColor: "#EEF2F6" }}
                        className="rounded-xl items-center justify-center"
                    >
                        <Package size={50} color="#9AA8B5" />
                    </View>
                )}
                <View className="flex-col my-5">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-3">
                            <Text className="text-xl font-bold">{title}</Text>
                            <View
                                className="self-start mt-2 px-3 py-1 rounded-full"
                                style={{ backgroundColor: statusInfo.bg }}
                            >
                                <Text className="text-xs font-semibold text-white">
                                    {statusInfo.label}
                                </Text>
                            </View>
                        </View>
                        {isBidding && (viewMode === "details" ? (
                            <TouchableOpacity
                                onPress={() => setViewMode("bids")}
                                className="bg-[#F0F7FF] px-4 py-2 rounded-full items-center justify-center border border-[#BDE0FF] flex-row gap-2 shadow-sm"
                            >
                                <View className="h-6 min-w-[24px] px-1 rounded-full bg-[#036BB4] items-center justify-center">
                                    <Text className="text-xs font-bold text-white">
                                        {bidCount}
                                    </Text>
                                </View>
    
                                <Text className="text-sm font-semibold text-[#036BB4]">{t("availableBids.shipmentDetails.bids")}</Text>
                                <ArrowIcon height={16} width={16} />
    
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setViewMode("details")}
                                className="bg-[#F0F7FF] px-4 py-2 rounded-full items-center justify-center border border-[#BDE0FF] flex-row gap-2 shadow-sm"
                            >
                                <View style={{ transform: [{ rotate: "180deg" }] }}>
                                    <ArrowIcon height={16} width={16} />
                                </View>
    
                                <Text className="text-sm font-semibold text-[#036BB4]">
                                    {t("availableBids.shipmentDetails.backToDetails")}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {/* Description now takes full width */}
                    <Text className="text-gray-600 mt-4 leading-relaxed">{description}</Text>
                </View>
                {/* 🔹 Content */}
                {(!isBidding || viewMode === "details") && (
                    <View
                        className="py-4">
                        {/* Header */}


                        {/* Basic Info */}
                        <InfoSection title={t("availableBids.shipmentDetails.basicInformation")}>
                            <View className="flex-row flex-1">
                                <InfoRow label={t("availableBids.shipmentDetails.category")} value={categoryLabel(category)} />
                                <InfoRow label={t("availableBids.shipmentDetails.weight")} value={weight} />
                            </View>
                            <View className="flex-row flex-1">
                                <InfoRow label={t("availableBids.shipmentDetails.dimensions")} value={dimensions} />
                                <InfoRow label={t("availableBids.shipmentDetails.packaging")} value={packaging} />
                            </View>

                        </InfoSection>

                        {/* Pickup & Delivery */}
                        <InfoSection title={t("availableBids.shipmentDetails.pickupDeliveryDetails")}>
                            <View className="flex-col">
                                <InfoRow label={t("availableBids.shipmentDetails.pickup")} value={pickup} />
                                <InfoRow label={t("availableBids.shipmentDetails.delivery")} value={delivery} />
                            </View>
                            <View className="flex-row flex-1">
                                <InfoRow label={t("availableBids.shipmentDetails.timeWindow")} value={timeWindow} />
                                <InfoRow label={t("availableBids.shipmentDetails.datePreference")} value={datePreference} />
                            </View>
                        </InfoSection>

                        {/* Amount */}
                        <InfoSection title={t("availableBids.shipmentDetails.amount")}>
                            <InfoRow label={t("availableBids.shipmentDetails.price")} value={price != null ? `€${price}` : "N/A"} />
                        </InfoSection>

                        {/* Driver Info */}
                        {driver && (
                            <InfoSection title={t("availableBids.shipmentDetails.driverInfo")}>
                                <InfoRow label={t("availableBids.shipmentDetails.name")} value={driver.name} />
                                <InfoRow label={t("availableBids.shipmentDetails.phone")} value={driver.phone} />
                                <InfoRow label={t("availableBids.shipmentDetails.email")} value={driver.email} />
                            </InfoSection>
                        )}

                        {/* Vehicle Info */}
                        {vehicle && (
                            <InfoSection title={t("availableBids.shipmentDetails.vehicleInfo")}>
                                <InfoRow label={t("availableBids.shipmentDetails.type")} value={vehicle.type} />
                                <InfoRow label={t("availableBids.shipmentDetails.number")} value={vehicle.number} />
                                <InfoRow label={t("availableBids.shipmentDetails.plate")} value={vehicle.plate} />
                            </InfoSection>
                        )}
                    </View>
                )}
                {isBidding && viewMode === "bids" && (
                    <View className="flex-1">
                        <ShipmentBidsList shipmentId={shipmentId} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}