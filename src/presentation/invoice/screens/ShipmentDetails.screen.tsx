import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    Dimensions,
    ActivityIndicator,
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

const { width } = Dimensions.get("window");
const PADDING = 16;
const IMAGE_WIDTH = width - PADDING * 2; // matches px-4 padding

type RoutePropType = RouteProp<AvailableBidsStackParamList, 'ShipmentDetails'>;
type NavigationPropType = NativeStackNavigationProp<AvailableBidsStackParamList, 'ShipmentDetails'>;

export default function ShipmentDetailsScreen() {
    const navigation = useNavigation<NavigationPropType>();
    const route = useRoute<RoutePropType>();
    const { shipmentId } = route.params;

    const [shipmentData, setShipmentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getShipmentDetailsUseCase(shipmentId);
            setShipmentData(res);
        } catch (err) {
            console.error("Error fetching shipment details:", err);
        } finally {
            setLoading(false);
        }
    }, [shipmentId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // Auto-scroll carousel
    useEffect(() => {
        if (!shipmentData?.images?.length) return;

        autoScrollRef.current = setInterval(() => {
            setActiveIndex((prev) => {
                const next = (prev + 1) % shipmentData.images.length;
                flatListRef.current?.scrollToIndex({ index: next, animated: true });
                return next;
            });
        }, 3000);

        return () => {
            if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        };
    }, [shipmentData?.images?.length]);

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
        title, description, category, weight, dimensions,
        packaging, images, pickup, delivery, timeWindow,
        datePreference, price, driver, vehicle, status, contactPerson,
    } = shipmentData;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <AppHeader text="Shipment Detail" onpress={() => navigation.goBack()} />

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Status Badge */}
                <View className="px-4 pt-3 pb-2">
                    <View className={`self-start px-3 py-1 rounded-full ${status === "IN_PROGRESS" ? "bg-orange-500" : "bg-green-500"}`}>
                        <Text className="text-white text-xs font-medium">
                            {status === "IN_PROGRESS" ? "In Progress" : "Delivered"}
                        </Text>
                    </View>
                </View>

                {/* 🔹 Image Carousel */}
                {images?.length > 0 && (
                    <View className="px-4">
                        <FlatList
                            ref={flatListRef}
                            data={images}
                            horizontal
                            pagingEnabled
                            scrollEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, i) => i.toString()}
                            getItemLayout={(_, index) => ({
                                length: IMAGE_WIDTH,
                                offset: IMAGE_WIDTH * index,
                                index,
                            })}
                            onMomentumScrollEnd={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / IMAGE_WIDTH);
                                setActiveIndex(index);
                            }}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: item }}
                                    style={{
                                        width: IMAGE_WIDTH,
                                        height: 200,
                                        borderRadius: 12,
                                    }}
                                    resizeMode="cover"
                                />
                            )}
                        />

                        {/* Dot Indicators */}
                        <View className="flex-row justify-center mt-2 gap-1">
                            {images.map((_: any, i: number) => (
                                <View
                                    key={i}
                                    style={{
                                        width: activeIndex === i ? 20 : 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: activeIndex === i ? "#f97316" : "#d1d5db",
                                        marginHorizontal: 2,
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* 🔹 Content */}
                <View className="px-4 py-4">
                    <View className="flex-row justify-between items-start mb-5">
                        <View className="flex-1 pr-3">
                            <Text className="text-xl font-bold">{title}</Text>
                            <Text className="text-gray-600 mt-1">{description}</Text>
                        </View>
                    </View>

                    <InfoSection title="Basic Information">
                        <InfoRow label="Category" value={category} />
                        <InfoRow label="Weight" value={weight} />
                        <InfoRow label="Dimensions" value={dimensions} />
                        <InfoRow label="Packaging" value={packaging} />
                    </InfoSection>

                    <InfoSection title="Pickup & Delivery Details">
                        <InfoRow label="Pickup" value={pickup} />
                        <InfoRow label="Delivery" value={delivery} />
                        <InfoRow label="Time Window" value={timeWindow} />
                        <InfoRow label="Date Preference" value={datePreference} />
                        <InfoRow label="Contact Person" value={contactPerson || "---"} />
                    </InfoSection>

                    <InfoSection title="Amount">
                        <InfoRow label="Price" value={`€${price}`} />
                    </InfoSection>

                    {driver && (
                        <InfoSection title="Driver Info">
                            <InfoRow label="Name" value={driver.name} />
                            <InfoRow label="Phone" value={driver.phone || "---"} />
                            <InfoRow label="Email" value={driver.email || "---"} />
                        </InfoSection>
                    )}

                    {vehicle && (
                        <InfoSection title="Vehicle Info">
                            <InfoRow label="Type" value={vehicle.type} />
                            <InfoRow label="Number" value={vehicle.number} />
                            <InfoRow label="Plate" value={vehicle.plate} />
                        </InfoSection>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}