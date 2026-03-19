import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    Dimensions,
    ActivityIndicator,
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

const carosoul = [
    "https://onepullwire.com/wp-content/uploads/2020/10/0001.jpg",
    "https://onepullwire.com/wp-content/uploads/2020/10/0001.jpg",
    "https://onepullwire.com/wp-content/uploads/2020/10/0001.jpg"
]

type RoutePropType = RouteProp<AvailableBidsStackParamList, 'ShipmentDetails'>;
type NavigationPropType = NativeStackNavigationProp<AvailableBidsStackParamList, 'ShipmentDetails'>;

export default function ShipmentDetailsScreen() {
    const navigation = useNavigation<NavigationPropType>();
    const route = useRoute<RoutePropType>();
    const { shipmentId } = route.params;

    const [shipmentData, setShipmentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

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
        contactPerson,
    } = shipmentData;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <AppHeader text="Shipment Detail" onpress={() => navigation.goBack()} />
            <View className="w-28 p-3 border-r border-gray-200 items-center justify-center">
                <Text
                    className={`px-2 py-1 rounded text-black text-xs ${status === 'IN_PROGRESS' ? "bg-orange-500" : "bg-green-500"
                        }`}
                >
                    {status === 'IN_PROGRESS' ? "In Progress" : "Delivered"}
                </Text>
            </View>            {/* 🔹 Image Carousel */}
            <FlatList
                data={carosoul}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={{ width, height: 500 }}
                        resizeMode="cover"
                    />
                )}
            />

            {/* 🔹 Content */}
            <View className="px-4 py-4">
                {/* Header */}
                <View className="flex-row justify-between items-start mb-5">
                    <View className="flex-1 pr-3">
                        <Text className="text-xl font-bold">{title}</Text>
                        <Text className="text-gray-600 mt-1">{description}</Text>
                    </View>
                </View>

                {/* Basic Info */}
                <InfoSection title="Basic Information">
                    <InfoRow label="Category" value={category} />
                    <InfoRow label="Weight" value={weight} />
                    <InfoRow label="Dimensions" value={dimensions} />
                    <InfoRow label="Packaging" value={packaging} />
                </InfoSection>

                {/* Pickup & Delivery */}
                <InfoSection title="Pickup & Delivery Details">
                    <InfoRow label="Pickup" value={pickup} />
                    <InfoRow label="Delivery" value={delivery} />
                    <InfoRow label="Time Window" value={timeWindow} />
                    <InfoRow label="Date Preference" value={datePreference} />
                    <InfoRow label="Contact Person" value={contactPerson} />

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
        </SafeAreaView>
    );
}