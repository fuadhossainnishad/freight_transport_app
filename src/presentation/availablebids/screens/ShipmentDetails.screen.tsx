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
import { getShipmentDetailsUseCase } from "../../../domain/usecases/shipment.usecase";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AvailableBidsStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AppHeader from "../../../shared/components/AppHeader";
import { getShipmentBids } from "../../../data/services/shipmentService";
import ShipmentBidsList from "../components/ShipmentBidsList";

import ArrowIcon from "../../../../assets/icons/arrow4.svg"

const { width } = Dimensions.get("window");

const carosoul = [
    "https://onepullwire.com/wp-content/uploads/2020/10/0001.jpg",
    "https://onepullwire.com/wp-content/uploads/2020/10/0001.jpg",
    "https://onepullwire.com/wp-content/uploads/2020/10/0001.jpg"
]

// Status values mirror the backend ShipmentStatus enum
// (Shipment/shipment.type.ts): PENDING, BIDDING, IN_PROGRESS,
// IN_TRANSIT, COMPLETED, CANCELLED.
const STATUS_CONFIG: Record<string, { label: string; bg: string }> = {
    PENDING: { label: "Pending", bg: "#64748B" },
    BIDDING: { label: "Bidding", bg: "#0EA5E9" },
    IN_PROGRESS: { label: "In Progress", bg: "#F97316" },
    IN_TRANSIT: { label: "In Transit", bg: "#8B5CF6" },
    COMPLETED: { label: "Completed", bg: "#22C55E" },
    CANCELLED: { label: "Cancelled", bg: "#EF4444" },
};

type RoutePropType = RouteProp<AvailableBidsStackParamList, 'ShipmentDetails'>;
type NavigationPropType = NativeStackNavigationProp<AvailableBidsStackParamList, 'ShipmentDetails'>;

export default function ShipmentDetailsScreen() {
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
            console.log("Fetched shipment:", res);
            setShipmentData(res);
        } catch (err) {
            console.error("Error fetching shipment details:", err);
        } finally {
            setLoading(false);
        }
    }, [shipmentId]);

    const fetchBidCount = useCallback(async () => {
        try {
            const bids = await getShipmentBids(shipmentId);
            setBidCount(bids.length);
        } catch (error) {
            console.log("Bid count error:", error);
        }
    }, [shipmentId]);

    useEffect(() => {
        fetchDetails();
        fetchBidCount();
    }, [fetchDetails, fetchBidCount]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!shipmentData) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text className="text-gray-500">Shipment details not available</Text>
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
    const statusInfo = STATUS_CONFIG[status] ?? { label: status ?? "Unknown", bg: "#64748B" };

    return (
        <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
            <AppHeader text="Shipment Detail" onpress={() => navigation.goBack()} />
            {/* 🔹 Image Carousel */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 px-4"
                contentContainerStyle={{ paddingBottom: 24 }}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                >
                    {carosoul.map((item, i) => (
                        <Image
                            key={i}
                            source={{ uri: item }}
                            style={{ width: width - 32, height: 200 }}
                            className="rounded-xl"
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>
                <View className="flex-row justify-between items-start my-5">
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
                        <Text className="text-gray-600 mt-1">{description}</Text>
                    </View>
                    {isBidding && (viewMode === "details" ? (
                        <TouchableOpacity
                            onPress={() => setViewMode("bids")}
                            className="bg-white px-5 py-2 rounded-xl items-center justify-center border border-black/10  flex-row gap-2"
                        >
                            <Text className="text-base font-semibold text-white bg-[#036BB4] p-1 px-2 rounded-full">
                                {bidCount}
                            </Text>

                            <Text className="text-base text-[#036BB4]">Bids</Text>
                            <ArrowIcon height={20} width={20} />

                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setViewMode("details")}
                            className="bg-white px-5 py-2 rounded-xl items-center justify-center border border-black/10  flex-row gap-2"
                        >
                            <View style={{ transform: [{ rotate: "180deg" }] }}>
                                <ArrowIcon height={20} width={20} />
                            </View>


                            <Text className="text-blue-500 font-medium">
                                Back to Details
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* 🔹 Content */}
                {(!isBidding || viewMode === "details") && (
                    <View
                        className="py-4">
                        {/* Header */}


                        {/* Basic Info */}
                        <InfoSection title="Basic Information">
                            <View className="flex-row flex-1">
                                <InfoRow label="Category" value={category} />
                                <InfoRow label="Weight" value={weight} />
                            </View>
                            <View className="flex-row flex-1">
                                <InfoRow label="Dimensions" value={dimensions} />
                                <InfoRow label="Packaging" value={packaging} />
                            </View>

                        </InfoSection>

                        {/* Pickup & Delivery */}
                        <InfoSection title="Pickup & Delivery Details">
                            <View className="flex-row flex-1">
                                <InfoRow label="Pickup" value={pickup} />
                                <InfoRow label="Delivery" value={delivery} />
                            </View>
                            <View className="flex-row flex-1">
                                <InfoRow label="Time Window" value={timeWindow} />
                                <InfoRow label="Date Preference" value={datePreference} />
                            </View>


                        </InfoSection>

                        {/* Amount */}
                        <InfoSection title="Amount">
                            <InfoRow label="Price" value={`€${price}`} />
                        </InfoSection>

                        {/* Driver Info */}
                        {driver && (
                            <InfoSection title="Driver Info">
                                <InfoRow label="Name" value={driver.name} />
                                <InfoRow label="Phone" value={driver.phone} />
                                <InfoRow label="Email" value={driver.email} />
                            </InfoSection>
                        )}

                        {/* Vehicle Info */}
                        {vehicle && (
                            <InfoSection title="Vehicle Info">
                                <InfoRow label="Type" value={vehicle.type} />
                                <InfoRow label="Number" value={vehicle.number} />
                                <InfoRow label="Plate" value={vehicle.plate} />
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