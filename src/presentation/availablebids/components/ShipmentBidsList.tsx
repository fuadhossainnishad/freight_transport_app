import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";

import {
    connectSocket,
    getSocket
} from "../../../data/socket/socketClient";
import { getShipmentBids } from "../../../data/services/shipmentService";
import Arrow from "../../../../assets/icons/arrow3.svg"
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AvailableBidsStackParamList } from "../../../navigation/types";


type NavigationPropType = NativeStackNavigationProp<AvailableBidsStackParamList>;


export default function ShipmentBidsList({ shipmentId }: { shipmentId: string }) {
    // const { shipmentId } = route.params;
    const navigation = useNavigation<NavigationPropType>();

    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const bidCount = useMemo(() => bids.length, [bids]);

    // Optional: replace with real backend time later
    const timeRemaining = "02h 15m";

    // =============================
    // Initial Fetch (Source of Truth)
    // =============================
    const fetchBids = useCallback(async () => {
        try {
            const data = await getShipmentBids(shipmentId!);
            console.log("getShipmentBids fetchBids:", data);

            setBids(data);
        } catch (error) {
            console.log("Fetch bids error:", error);
        } finally {
            setLoading(false);
        }
    }, [shipmentId]);

    // =============================
    // Socket Setup (Live Updates)
    // =============================
    // useEffect(() => {
    //     let socket: any;

    //     const init = async () => {
    //         socket = await connectSocket();

    //         socket.emit("join_shipment_room", shipmentId);
    //         console.log("Bid join_shipment_room:");


    //         socket.on("new_bid", (bid: any) => {
    //             setBids((prev) => {
    //                 // prevent duplicate
    //                 if (prev.some((b) => b.id === bid.id)) return prev;

    //                 return [bid, ...prev];
    //             });
    //         });

    //         socket.on("bid_accepted", (data: any) => {
    //             console.log("Bid accepted:", data);
    //         });
    //     };

    //     init();
    //     fetchBids();

    //     return () => {
    //         const socketInstance = getSocket();

    //         if (socketInstance) {
    //             socketInstance.emit("leave_shipment_room", shipmentId);
    //             socketInstance.off("new_bid");
    //             socketInstance.off("bid_accepted");
    //         }
    //     };
    // }, [shipmentId, fetchBids]);

    useEffect(() => {
        let socket: any;

        const init = async () => {
            socket = await connectSocket();

            socket.on("connect", () => {
                console.log("✅ Connected:", socket.id);
            });

            socket.onAny((event: string, ...args: any[]) => {
                console.log("📡 Event:", event, args);
            });

            console.log("📡 Joining room:", shipmentId);
            socket.emit("join_shipment_room", shipmentId);

            socket.on("new_bid", (bid: any) => {
                console.log("🔥 New bid received:", bid);

                setBids((prev) => {
                    if (prev.some((b) => b.id === bid.id)) return prev;
                    return [bid, ...prev];
                });
            });
        };

        init();
        fetchBids();

        return () => {
            if (socket) {
                socket.emit("leave_shipment_room", shipmentId);
                socket.off("new_bid");
            }
        };
    }, [shipmentId, fetchBids]);

    // =============================
    // UI
    // =============================
    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View className="gap-4">
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="font-semibold text-base">Bids: {bidCount}</Text>
                    <Text className="font-semibold text-base">Time Remaining: {timeRemaining}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('AssignVehicleDriver', { shipmentId }) }}
                    className="items-center flex-row gap-1 p-2 rounded-lg bg-[#036BB4]">
                    <Text className="text-white">Place your bid</Text>
                    <Arrow height={20} width={20} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={bids}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text className="text-gray-500 text-center">No bids found</Text>}
                renderItem={({ item }) => (
                    <View className="border border-gray-200 rounded-lg p-3 mb-2">
                        <Text>Transporter: {item.transporter_id}</Text>
                        <Text className="text-[#036BB4] font-bold mt-1">
                            €{item.bid_amount}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}