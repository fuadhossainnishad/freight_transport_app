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
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import ShipmentMapRoute from '../../transporter/components/ShipmentMapRoute';

type RoutePropType = RouteProp<ActiveShipmentsStackParamList, 'ShipmentTracking'>;
type NavigationPropType = NativeStackNavigationProp<ActiveShipmentsStackParamList, 'ShipmentTracking'>;

const BLUE = "#036BB4";

// Keys are backend enums — never translate them. Only labelKey is translated.
const STATUS: Record<string, { labelKey: ParseKeys; bg: string }> = {
    IN_PROGRESS: { labelKey: "shipper.status.inProgress", bg: "#F97316" },
    IN_TRANSIT: { labelKey: "shipper.status.inTransit", bg: "#2563EB" },
    COMPLETED: { labelKey: "shipper.status.delivered", bg: "#22C55E" },
    DELIVERED: { labelKey: "shipper.status.delivered", bg: "#22C55E" },
    BIDDING: { labelKey: "shipper.status.bidding", bg: "#0EA5E9" },
    PENDING: { labelKey: "shipper.status.pending", bg: "#64748B" },
    CANCELLED: { labelKey: "shipper.status.cancelled", bg: "#EF4444" },
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
    const { t } = useTranslation();
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
    // Unmapped statuses still fall back to the raw backend enum, as before.
    const statusConfig = STATUS[data.status];
    const status = {
        label: statusConfig ? t(statusConfig.labelKey) : data.status,
        bg: statusConfig?.bg ?? "#64748B",
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <AppHeader text={t("shipper.tracking.title")} onpress={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
                {/* Status badge */}
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{status.label}</Text>
                </View>

                {/* Map */}
                <ShipmentMapRoute
                    shipmentId={shipmentId}
                    pickupAddress={data.pickup}
                    deliveryAddress={data.delivery}
                    pickupCoord={data.pickupCoord}
                    deliveryCoord={data.deliveryCoord}
                    status={data.status}
                    live
                    showBadge={false}
                />

                {/* Basic Information */}
                <Text style={styles.sectionTitle}>{t("shipper.tracking.basicInformation")}</Text>
                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <Field label={t("shipper.tracking.shipmentId")} value={data.id} />
                        <Field label={t("shipper.tracking.shipmentTitle")} value={data.title} />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.cardRow}>
                        <Field label={t("shipper.tracking.estimatedDelivery")} value={data.datePreference} />
                    </View>
                </View>

                {/* Vehicle Details */}
                {vehicle && (
                    <>
                        <Text style={styles.sectionTitle}>{t("shipper.tracking.vehicleDetails")}</Text>
                        <View style={styles.card}>
                            <View style={styles.cardRow}>
                                <Field label={t("shipper.tracking.vehicleType")} value={vehicle.type} />
                                <Field label={t("shipper.tracking.plateNumber")} value={vehicle.plate} />
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.cardRow}>
                                <Field
                                    label={t("shipper.tracking.capacity")}
                                    value={vehicle.capacity ? t("shipper.tracking.capacityValue", { value: vehicle.capacity }) : null}
                                />
                            </View>
                        </View>

                        {vehicle.images?.length > 0 && (
                            <>
                                <Text style={styles.subLabel}>{t("shipper.tracking.vehicleImages")}</Text>
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
                        <Text style={styles.sectionTitle}>{t("shipper.tracking.driverDetails")}</Text>
                        <View style={styles.card}>
                            <View style={styles.cardRow}>
                                <Field label={t("shipper.tracking.driverName")} value={driver.name} />
                                <Field label={t("shipper.tracking.driverPhone")} value={driver.phone} />
                            </View>
                        </View>
                    </>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.reportBtn} activeOpacity={0.85}>
                        <Text style={styles.reportTxt}>{t("shipper.tracking.reportIssue")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} disabled>
                        <Text style={styles.confirmTxt}>{t("shipper.tracking.confirmDelivery")}</Text>
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
