import React, { useState, useEffect } from "react";
import {
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";

import { searchDrivers } from "../../../data/services/driverService";
import { searchVehicles } from "../../../data/services/vehicleService";
import { getSocket } from "../../../data/socket/socketClient";
import { createBid } from "../../../data/services/bidService";
import { AvailableBidsStackParamList } from "../../../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from '../../../shared/components/AppHeader';
import { useAuth } from "../../../app/context/Auth.context";


type RoutePropType = RouteProp<AvailableBidsStackParamList, 'AssignVehicleDriver'>;
type NavigationPropType = NativeStackNavigationProp<AvailableBidsStackParamList, 'AssignVehicleDriver'>;


export default function AssignVehicleDriverScreen() {
    const navigation = useNavigation<NavigationPropType>();
    const route = useRoute<RoutePropType>();
    const { shipmentId } = route.params;

    const { user } = useAuth()
    const transporterId = user?.transporter_id!

    const [driverQuery, setDriverQuery] = useState("");
    const [vehicleQuery, setVehicleQuery] = useState("");

    const [drivers, setDrivers] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);

    const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

    const [price, setPrice] = useState("");
    const [loadingDriver, setLoadingDriver] = useState(false);
    const [loadingVehicle, setLoadingVehicle] = useState(false);

    // =============================
    // 🔍 Search Drivers (Debounced)
    // =============================
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!driverQuery) return;

            try {
                setLoadingDriver(true);
                const data = await searchDrivers(transporterId!, driverQuery);
                console.log("Driver search data:", data);

                setDrivers(data);
            } catch (err) {
                console.log("Driver search error:", err);
            } finally {
                setLoadingDriver(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [driverQuery, transporterId]);

    // =============================
    // 🔍 Search Vehicles
    // =============================
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!vehicleQuery) return;

            try {
                setLoadingVehicle(true);
                const data = await searchVehicles(transporterId!, vehicleQuery);
                console.log("Vehicle search data:", data);
                setVehicles(data);
            } catch (err) {
                console.log("Vehicle search error:", err);
            } finally {
                setLoadingVehicle(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [vehicleQuery, transporterId]);

    // =============================
    // 🚀 Submit
    // =============================
    const [submitting, setSubmitting] = useState(false);


    const handleSubmit = async () => {
        if (!selectedDriver || !selectedVehicle || !price) {
            console.log("❌ Missing required fields");
            return;
        }

        try {
            setSubmitting(true);

            const buildBidPayload = () => {
                if (!transporterId) throw new Error("Missing transporter_id");
                if (!shipmentId) throw new Error("Missing shipment_id");
                if (!selectedDriver?._id) throw new Error("Driver not selected");
                if (!selectedVehicle?._id) throw new Error("Vehicle not selected");
                if (!price || isNaN(Number(price))) throw new Error("Invalid bid amount");

                return {
                    transporter_id: transporterId,
                    shipment_id: shipmentId,
                    driver_id: selectedDriver._id,
                    vehicle_id: selectedVehicle._id,
                    bid_amount: Number(price),
                };
            };

            const payload = buildBidPayload(); // ✅ IMPORTANT FIX

            console.log("📦 Final Payload:", payload);

            const res = await createBid(payload);

            console.log("✅ Bid created:", res);

            const socket = getSocket();
            socket?.emit("new_bid", res?.data);

            setSelectedDriver(null);
            setSelectedVehicle(null);
            setPrice("");

            navigation.goBack();

        } catch (error: any) {
            console.log("❌ Submit bid error:", error.message || error);
        } finally {
            setSubmitting(false);
        }
    };

    // =============================
    // UI
    // =============================
    return (
        <SafeAreaView edges={['top']} className="p-4">
            <AppHeader text="Assign Vehicle & Driver" onpress={() => navigation.goBack()} />
            {/* 🔹 DRIVER SEARCH */}
            <Text className="font-bold mb-1">Search Driver</Text>
            <TextInput
                placeholder="Search driver..."
                value={driverQuery}
                onChangeText={setDriverQuery}
                className="border p-2 rounded mb-2"
            />

            {loadingDriver && <ActivityIndicator />}

            <FlatList
                data={drivers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedDriver(item)}
                        className={`p-3 border mb-1 rounded ${selectedDriver?._id === item._id
                            ? "bg-blue-100"
                            : ""
                            }`}
                    >
                        <Text>{item.driver_name}</Text>
                        <Text>{item.number}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* 🔹 VEHICLE SEARCH */}
            <Text className="font-bold mt-4 mb-1">Search Vehicle</Text>
            <TextInput
                placeholder="Search vehicle..."
                value={vehicleQuery}
                onChangeText={setVehicleQuery}
                className="border p-2 rounded mb-2"
            />

            {loadingVehicle && <ActivityIndicator />}

            <FlatList
                data={vehicles}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedVehicle(item)}
                        className={`p-3 border mb-1 rounded ${selectedVehicle?._id === item._id
                            ? "bg-green-100"
                            : ""
                            }`}
                    >
                        <Text>{item.vehicle_type}</Text>
                        <Text>Plate: {item.plate_number}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* 💰 PRICE */}
            <Text className="font-bold mt-4 mb-1">Place your Price</Text>
            <TextInput
                placeholder="Enter price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                className="border p-2 rounded mb-4"
            />

            {/* 🚀 SUBMIT */}
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                className={`p-3 rounded items-center ${submitting ? "bg-gray-400" : "bg-[#036BB4]"
                    }`}
            >
                <Text className="text-white font-bold">
                    {submitting ? "Submitting..." : "Submit"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}