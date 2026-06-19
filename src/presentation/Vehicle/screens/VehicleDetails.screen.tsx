import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { deleteVehicle, getVehicleById } from "../../../data/services/vehicleService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VehicleStackParamList } from "../../../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Pencil, Trash2, FileText, ChevronRight } from "lucide-react-native";
import AppHeader from "../../../shared/components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { Vehicle, VehicleDocument } from "../../../domain/entities/vehicle";
import DocsPreviewModal from "../components/DocsPreviewModal";
import VehicleImageCarousel from "../components/VehicleImageCarousel";

type props = NativeStackNavigationProp<VehicleStackParamList, "VehicleDetails">;
type RoutePropType = RouteProp<VehicleStackParamList, "VehicleDetails">;

const PRIMARY = "#036BB4";
const DANGER = "#EF4444";

const DOC_LABELS: Record<string, string> = {
    plateId: "Plate ID",
    insurance: "Insurance",
    technicalVisit: "Technical Visit",
    registration: "Registration",
};

const formatCapacity = (capacity?: string) => {
    if (!capacity) return "—";
    const trimmed = capacity.trim();
    return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed} Tons` : trimmed;
};

const isPdf = (uri: string) => /\.pdf(\?|$)/i.test(uri.trim());

/* ── Reusable bits ─────────────────────────────── */

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <View className="bg-white rounded-2xl border border-gray-100 px-4 py-1 mb-4">
        <Text className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mt-3 mb-1">
            {title}
        </Text>
        {children}
    </View>
);

const SpecRow: React.FC<{ label: string; value: string; first?: boolean }> = ({ label, value, first }) => (
    <View className={`flex-row items-center justify-between py-3.5 ${first ? "" : "border-t border-gray-100"}`}>
        <Text className="text-sm text-gray-500">{label}</Text>
        <Text className="text-sm font-semibold text-gray-900 ml-4 flex-1 text-right" numberOfLines={1}>
            {value}
        </Text>
    </View>
);

/* ── Screen ────────────────────────────────────── */

const VehicleDetailsScreen = () => {
    const navigation = useNavigation<props>();
    const route = useRoute<RoutePropType>();
    const { vehicleId } = route.params;
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [preview, setPreview] = useState<{ uri: string; title: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchVehicle();
    }, []);

    const fetchVehicle = async () => {
        try {
            setLoading(true);
            const res = await getVehicleById(vehicleId);
            setVehicle(res);
        } catch (err) {
            Alert.alert("Error", "Failed to load vehicle");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert("Delete vehicle", "Are you sure you want to remove this vehicle?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: confirmDelete },
        ]);
    };

    const confirmDelete = async () => {
        try {
            setDeleting(true);
            await deleteVehicle(vehicleId);
            navigation.goBack();
        } catch (err) {
            Alert.alert("Error", "Failed to delete vehicle");
        } finally {
            setDeleting(false);
        }
    };

    // Flatten documents into display rows, numbering when a type repeats.
    const documents = useMemo(() => {
        if (!vehicle) return [];
        const byType: Record<string, VehicleDocument[]> = {};
        vehicle.documents.forEach((d) => {
            (byType[d.type] ||= []).push(d);
        });

        const rows: { id: string; url: string; label: string; pdf: boolean }[] = [];
        Object.entries(byType).forEach(([type, docs]) => {
            docs.forEach((d, i) => {
                const base = DOC_LABELS[type] || "Document";
                rows.push({
                    id: d.id,
                    url: d.url,
                    label: docs.length > 1 ? `${base} ${i + 1}` : base,
                    pdf: isPdf(d.url),
                });
            });
        });
        return rows;
    }, [vehicle]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color={PRIMARY} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
            <AppHeader text="Vehicle Details" onpress={() => navigation.goBack()} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 104 }}
            >
                {/* Photos */}
                <VehicleImageCarousel images={vehicle?.images || []} />

                {/* Identity */}
                <View className="mt-4 mb-4">
                    {!!vehicle?.type && (
                        <Text className="text-[11px] font-bold tracking-wider uppercase" style={{ color: PRIMARY }}>
                            {vehicle.type}
                        </Text>
                    )}
                    <Text className="text-2xl font-bold text-gray-900 mt-1" numberOfLines={1}>
                        {vehicle?.name || "Unnamed vehicle"}
                    </Text>
                    {!!vehicle?.plateNumber && (
                        <Text className="text-sm text-gray-500 mt-0.5">Plate {vehicle.plateNumber}</Text>
                    )}
                </View>

                {/* Specifications */}
                <SectionCard title="Specifications">
                    <SpecRow first label="Plate Number" value={vehicle?.plateNumber || "—"} />
                    <SpecRow label="Vehicle Type" value={vehicle?.type || "—"} />
                    <SpecRow label="Capacity" value={formatCapacity(vehicle?.capacity)} />
                    <SpecRow label="Year Model" value={vehicle?.modelYear || "—"} />
                </SectionCard>

                {/* Documents */}
                {documents.length > 0 && (
                    <SectionCard title="Documents">
                        {documents.map((doc, i) => (
                            <TouchableOpacity
                                key={doc.id}
                                activeOpacity={0.7}
                                onPress={() => setPreview({ uri: doc.url, title: doc.label })}
                                className={`flex-row items-center py-3 ${i === 0 ? "" : "border-t border-gray-100"}`}
                            >
                                {/* Thumbnail / file glyph */}
                                {doc.pdf ? (
                                    <View className="w-11 h-11 rounded-lg bg-[#036BB4]/10 items-center justify-center">
                                        <FileText size={20} color={PRIMARY} strokeWidth={2} />
                                    </View>
                                ) : (
                                    <Image
                                        source={{ uri: doc.url }}
                                        className="w-11 h-11 rounded-lg bg-gray-100"
                                        resizeMode="cover"
                                    />
                                )}

                                <View className="flex-1 ml-3">
                                    <Text className="text-sm font-semibold text-gray-900">{doc.label}</Text>
                                    <Text className="text-xs text-gray-400 mt-0.5">
                                        {doc.pdf ? "PDF document" : "Image"} · Tap to view
                                    </Text>
                                </View>

                                <ChevronRight size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))}
                    </SectionCard>
                )}
            </ScrollView>

            {/* Sticky action bar */}
            <View
                className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex-row items-center gap-3"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 12,
                }}
            >
                <TouchableOpacity
                    onPress={handleDelete}
                    disabled={deleting}
                    className="items-center justify-center rounded-full border"
                    style={{ width: 52, height: 52, flexShrink: 0, borderColor: DANGER }}
                >
                    {deleting ? (
                        <ActivityIndicator color={DANGER} />
                    ) : (
                        <Trash2 size={20} color={DANGER} strokeWidth={2} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate("UpdateVehicle", { vehicleId })}
                    activeOpacity={0.85}
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-full"
                    style={{ backgroundColor: PRIMARY, height: 52 }}
                >
                    <Pencil size={18} color="#fff" strokeWidth={2} />
                    <Text className="text-white font-semibold text-base">Edit Vehicle</Text>
                </TouchableOpacity>
            </View>

            <DocsPreviewModal
                visible={!!preview}
                imageUri={preview?.uri}
                title={preview?.title}
                onClose={() => setPreview(null)}
            />
        </SafeAreaView>
    );
};

export default VehicleDetailsScreen;
