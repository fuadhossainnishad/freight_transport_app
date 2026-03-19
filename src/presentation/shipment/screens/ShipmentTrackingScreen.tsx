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
import MapView, { Marker } from "react-native-maps";

import AppHeader from "../../../shared/components/AppHeader";
import { getShipmentDetailsUseCase } from "../../../domain/usecases/shipment.usecase";
import { ActiveShipmentsStackParamList } from "../../../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
                <View style={{ height: 250, borderRadius: 12, overflow: "hidden" }}>
                    {formattedCoords.length > 0 && (
                        <MapView
                            style={{ flex: 1 }}
                            initialRegion={{
                                latitude: formattedCoords[0].latitude,
                                longitude: formattedCoords[0].longitude,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        >
                            {formattedCoords.map((c, index) => (
                                <Marker key={index} coordinate={c} title={data.title} />
                            ))}
                        </MapView>
                    )}
                </View>

                {/* Basic Shipment Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <Text>Shipment ID: {data._id}</Text>
                    <Text>Title: {data.data_title}</Text>
                    <Text>Estimated Delivery: {data.date_preference}</Text>
                </View>

                {/* Vehicle Details */}
                {vehicle && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Vehicle Details</Text>
                        <Text>Type: {vehicle.type}</Text>
                        <Text>Plate Number: {vehicle.plate}</Text>
                        <Text>Capacity: {vehicle.capacity} Tons</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {vehicle.images.map((img: string, idx: number) => (
                                <Image key={idx} source={{ uri: img }} style={styles.vehicleImage} />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Driver Details */}
                {driver && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Driver Details</Text>
                        <Text>Name: {driver.name}</Text>
                        <Text>Phone: {driver.phone}</Text>
                        <Text>Email: {driver.email}</Text>
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