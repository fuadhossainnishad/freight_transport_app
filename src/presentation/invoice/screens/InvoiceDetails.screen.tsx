import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    FlatList,
    Dimensions,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { InvoiceStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AppHeader from '../../../shared/components/AppHeader';
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const PADDING = 16;
const IMAGE_WIDTH = width - PADDING * 2; // matches px-4 padding

type RoutePropType = RouteProp<InvoiceStackParamList, 'InvoiceDetails'>;
type NavigationPropType = NativeStackNavigationProp<InvoiceStackParamList, 'InvoiceDetails'>;

export default function InvoiceDetailsScreen() {
    const navigation = useNavigation<NavigationPropType>();
    const route = useRoute<RoutePropType>();
    const { shipmentId } = route.params;

    const [shipmentData, setShipmentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // const fetchDetails = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const res = await getShipmentDetailsUseCase(shipmentId);
    //         setShipmentData(res);
    //     } catch (err) {
    //         console.error("Error fetching shipment details:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [shipmentId]);

    // useEffect(() => {
    //     fetchDetails();
    // }, [fetchDetails]);

    // // Auto-scroll carousel
    // useEffect(() => {
    //     if (!shipmentData?.images?.length) return;

    //     autoScrollRef.current = setInterval(() => {
    //         setActiveIndex((prev) => {
    //             const next = (prev + 1) % shipmentData.images.length;
    //             flatListRef.current?.scrollToIndex({ index: next, animated: true });
    //             return next;
    //         });
    //     }, 3000);

    //     return () => {
    //         if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    //     };
    // }, [shipmentData?.images?.length]);

    // if (loading) {
    //     return (
    //         <SafeAreaView className="flex-1 justify-center items-center">
    //             <ActivityIndicator size="large" />
    //         </SafeAreaView>
    //     );
    // }

    // if (!shipmentData) {
    //     return (
    //         <SafeAreaView className="flex-1 justify-center items-center">
    //             <Text className="text-gray-500">Shipment details not available</Text>
    //         </SafeAreaView>
    //     );
    // }

    // const {
    //     title, description, category, weight, dimensions,
    //     packaging, images, pickup, delivery, timeWindow,
    //     datePreference, price, driver, vehicle, status, contactPerson,
    // } = shipmentData;

    const invoice = {
        number: "INV-2025-00428",
        status: "Paid",
        issuedOn: "12 Feb 2025",
        dueDate: "19 Feb 2025",
        shipmentTitle: "Ship 12 Pallets of Rice",
        shipmentId: "#####",
        pickupAddress: "Rue 14.12, Ouagadougou",
        deliveryAddress: "Rue 14.12, Ouagadougou",
        deliveryDate: "14 Feb, 3:45 PM",
        paymentMethod: "Bank Transfer",
        weightCategory: "Bank Transfer",
        currency: "€",
        breakdown: [
            { label: "Transport Fee", amount: 150.0 },
            { label: "Platform Service Fee", amount: 2.0 },
        ],
    };

    const total = invoice.breakdown.reduce((sum, item) => sum + item.amount, 0);

    return (
        <SafeAreaView edges={['top']} className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <AppHeader text="Invoice Summary" onpress={() => navigation.goBack()} />
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h1 className="text-xl font-semibold">Invoice Summary</h1>
                        <p className="text-sm text-gray-500">Invoice #{invoice.number}</p>
                    </div>
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                        {invoice.status}
                    </span>
                </div>

                {/* Shipment Info */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard title="Shipment Information">
                        <InfoRow label="Shipment ID" value={invoice.shipmentId} />
                        <InfoRow label="Shipment Title" value={invoice.shipmentTitle} />
                        <InfoRow label="Issued On" value={invoice.issuedOn} />
                        <InfoRow label="Due Date" value={invoice.dueDate} />
                        <InfoRow label="Delivery Date" value={invoice.deliveryDate} />
                    </InfoCard>

                    <InfoCard title="Addresses">
                        <InfoRow label="Pickup Address" value={invoice.pickupAddress} />
                        <InfoRow label="Delivery Address" value={invoice.deliveryAddress} />
                        <InfoRow label="Payment Method" value={invoice.paymentMethod} />
                        <InfoRow label="Weight Category" value={invoice.weightCategory} />
                    </InfoCard>
                </div>

                {/* Cost Breakdown */}
                <div className="px-6 pb-6">
                    <h2 className="text-lg font-semibold mb-3">Cost Breakdown</h2>
                    <div className="border rounded-xl overflow-hidden">
                        {invoice.breakdown.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between px-4 py-3 border-b last:border-b-0"
                            >
                                <span className="text-gray-600">{item.label}</span>
                                <span className="font-medium">
                                    {invoice.currency}{item.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}

                        <div className="flex justify-between px-4 py-4 bg-gray-50 font-semibold">
                            <span>Total</span>
                            <span>
                                {invoice.currency}{total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t">
                    <button className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">
                        Download Invoice
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
                        Print
                    </button>
                </div>
            </div>
        </SafeAreaView>
    );
}

function InfoCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string, value: String }) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-800 text-right break-words">{value}</span>
        </div>
    );
}

