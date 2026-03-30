// screens/shipments/ShipmentTrackingScreen.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";
import { getShipmentDetailsUseCase } from "../../../domain/usecases/shipment.usecase";
import { ActiveShipmentsStackParamList } from "../../../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapRoute from '../components/MapRoute';

type RoutePropType = RouteProp<ActiveShipmentsStackParamList, 'ShipmentTracking'>;
type NavigationPropType = NativeStackNavigationProp<ActiveShipmentsStackParamList, 'ShipmentTracking'>;


const ShipmentTrackingScreen: React.FC = () => {
    const navigation = useNavigation<NavigationPropType>();
    const route = useRoute<RoutePropType>();
    const { shipmentId } = route.params;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);


    useEffect(() => {
        const loadShipment = async () => {
            try {
                setLoading(true);
                const res = await getShipmentDetailsUseCase(shipmentId);
                console.log("getShipmentDetailsUseCase for tracking:", res)
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadShipment();
    }, [shipmentId]);

    if (loading || !data) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#036BB4" />
            </View>
        );
    }

    const { vehicle, driver, locationHistory } = data;

    // Dummy map coordinates if empty
    const coords =
        locationHistory?.coordinates?.length > 0
            ? locationHistory.coordinates
            : [[23.8103, 90.4125]]; // fallback

    const formattedCoords = coords.map((c: any) => ({
        latitude: Number(c[0]) || 23.8103,
        longitude: Number(c[1]) || 90.4125,
    }));

    console.log("formattedCoords:", formattedCoords)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <AppHeader text="Shipment Tracking" onpress={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Map */}
                <MapRoute />

                {/* Basic Shipment Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <Text>Shipment ID: {data.id}</Text>
                    <Text>Title: {data.title}</Text>
                    <Text>Estimated Delivery: {data.datePreference!}</Text>
                </View>

                {/* Vehicle Details */}
                {vehicle && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Vehicle Details</Text>
                        <Text>Type: {vehicle.type}</Text>
                        <Text>Plate Number: {vehicle.plate}</Text>
                        <Text>Capacity: {vehicle.capacity || "-"} Tons</Text>

                        <View className="mt-4 text-bg-gray-100 gap-2">
                            <Text className="">Vehicle Images:</Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{}}>
                                {vehicle.images.map((img: string, idx: number) => (
                                    <Image key={idx} source={{ uri: img }} style={styles.vehicleImage} />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* Driver Details */}
                {driver && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Driver Details</Text>
                        <Text>Name: {driver.name}</Text>
                        <Text>Phone: {driver.phone || "-"}</Text>
                        <Text>Email: {driver.email || "-"}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ShipmentTrackingScreen;

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    section: { marginTop: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
    vehicleImage: { width: 120, height: 80, marginRight: 8, borderRadius: 8 },
});