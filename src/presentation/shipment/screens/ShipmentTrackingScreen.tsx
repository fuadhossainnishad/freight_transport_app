// screens/shipments/ShipmentTrackingScreen.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";
import { getShipmentDetailsUseCase } from "../../../domain/usecases/shipment.usecase";
import { ActiveShipmentsStackParamList } from "../../../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ShipmentMapRoute from '../../transporter/components/ShipmentMapRoute';

type RoutePropType = RouteProp<ActiveShipmentsStackParamList, 'ShipmentTracking'>;
type NavigationPropType = NativeStackNavigationProp<ActiveShipmentsStackParamList, 'ShipmentTracking'>;

const BLUE = "#036BB4";

const STATUS: Record<string, { label: string; bg: string }> = {
    IN_PROGRESS: { label: "In progress", bg: "#F97316" },
    IN_TRANSIT: { label: "In transit", bg: "#2563EB" },
    COMPLETED: { label: "Delivered", bg: "#22C55E" },
    DELIVERED: { label: "Delivered", bg: "#22C55E" },
    BIDDING: { label: "Bidding", bg: "#0EA5E9" },
    PENDING: { label: "Pending", bg: "#64748B" },
    CANCELLED: { label: "Cancelled", bg: "#EF4444" },
};

// One labelled field inside a card
function Field({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{value ?? "-"}</Text>
        </View>
    );
}

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
                <ActivityIndicator size="large" color={BLUE} />
            </View>
        );
    }

    const { vehicle, driver } = data;
    const status = STATUS[data.status] ?? { label: data.status, bg: "#64748B" };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <AppHeader text="Shipment Tracking" onpress={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
                {/* Status badge */}
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{status.label}</Text>
                </View>

                {/* Map */}
                <ShipmentMapRoute
                    pickupAddress={data.pickup}
                    deliveryAddress={data.delivery}
                    status={data.status}
                    showBadge={false}
                />

                {/* Basic Information */}
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <Field label="Shipment Id" value={data.id} />
                        <Field label="Shipment title" value={data.title} />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.cardRow}>
                        <Field label="Estimated Delivery" value={data.datePreference} />
                    </View>
                </View>

                {/* Vehicle Details */}
                {vehicle && (
                    <>
                        <Text style={styles.sectionTitle}>Vehicle Details</Text>
                        <View style={styles.card}>
                            <View style={styles.cardRow}>
                                <Field label="Vehicle Type" value={vehicle.type} />
                                <Field label="Plate Number" value={vehicle.plate} />
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.cardRow}>
                                <Field label="Capacity" value={vehicle.capacity ? `${vehicle.capacity} Tons` : null} />
                            </View>
                        </View>

                        {vehicle.images?.length > 0 && (
                            <>
                                <Text style={styles.subLabel}>Vehicle Images</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ gap: 10 }}
                                >
                                    {vehicle.images.map((img: string, idx: number) => (
                                        <Image key={idx} source={{ uri: img }} style={styles.vehicleImage} />
                                    ))}
                                </ScrollView>
                            </>
                        )}
                    </>
                )}

                {/* Driver Details */}
                {driver && (
                    <>
                        <Text style={styles.sectionTitle}>Driver Details</Text>
                        <View style={styles.card}>
                            <View style={styles.cardRow}>
                                <Field label="Name" value={driver.name} />
                                <Field label="Phone" value={driver.phone} />
                            </View>
                        </View>
                    </>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.reportBtn} activeOpacity={0.85}>
                        <Text style={styles.reportTxt}>Report an Issue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} disabled>
                        <Text style={styles.confirmTxt}>Confirm Delivery</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ShipmentTrackingScreen;

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        marginBottom: 14,
    },
    statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#fff" },
    statusText: { color: "#fff", fontSize: 12, fontWeight: "700" },

    sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginTop: 18, marginBottom: 10 },
    subLabel: { fontSize: 13, color: "#6B7280", marginTop: 14, marginBottom: 8 },

    card: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: "#fff",
    },
    cardRow: { flexDirection: "row", gap: 12 },
    divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 14 },

    fieldLabel: { fontSize: 12, color: "#9CA3AF", marginBottom: 6 },
    fieldValue: { fontSize: 15, fontWeight: "700", color: "#111827" },

    vehicleImage: { width: 110, height: 78, borderRadius: 10, backgroundColor: "#F1F5F9" },

    actions: { flexDirection: "row", gap: 12, marginTop: 26 },
    reportBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: BLUE,
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: "center",
    },
    reportTxt: { color: BLUE, fontSize: 14, fontWeight: "700" },
    confirmBtn: {
        flex: 1,
        backgroundColor: "#9CA3AF",
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: "center",
    },
    confirmTxt: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
