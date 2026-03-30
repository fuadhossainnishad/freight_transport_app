import React, { useState, useEffect, useMemo } from "react";
import {
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Alert,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { searchDrivers } from "../../../data/services/driverService";
import { searchVehicles } from "../../../data/services/vehicleService";
import { getSocket } from "../../../data/socket/socketClient";
import { createBid } from "../../../data/services/bidService";

import {
    AvailableBidsStackParamList
} from "../../../navigation/types";

import {
    RouteProp,
    useNavigation,
    useRoute
} from "@react-navigation/native";

import {
    NativeStackNavigationProp
} from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";
import { useAuth } from "../../../app/context/Auth.context";
import DriverItem from "../components/DriverItem";
import VehicleItem from "../components/VehicleItem";
import { KeyboardAvoidingView } from "react-native";

type RoutePropType = RouteProp<
    AvailableBidsStackParamList,
    "AssignVehicleDriver"
>;

type NavigationPropType = NativeStackNavigationProp<
    AvailableBidsStackParamList,
    "AssignVehicleDriver"
>;

export default function AssignVehicleDriverScreen() {
    const navigation = useNavigation<NavigationPropType>();
    const route = useRoute<RoutePropType>();
    const { shipmentId } = route.params;

    const { user } = useAuth();
    const transporterId = user?.transporter_id!;

    // ================= STATE =================
    const [driverQuery, setDriverQuery] = useState("");
    const [vehicleQuery, setVehicleQuery] = useState("");

    const [drivers, setDrivers] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);

    const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

    const [price, setPrice] = useState("");

    const [loadingDriver, setLoadingDriver] = useState(false);
    const [loadingVehicle, setLoadingVehicle] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [errors, setErrors] = useState<{
        driver?: string;
        vehicle?: string;
        price?: string;
    }>({});

    // ================= SEARCH (DEBOUNCED) =================
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!driverQuery) return;

            try {
                setLoadingDriver(true);
                const data = await searchDrivers(transporterId, driverQuery);
                setDrivers(data || []);
            } catch (err) {
                console.log("Driver search error:", err);
            } finally {
                setLoadingDriver(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [driverQuery, transporterId]);

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!vehicleQuery) return;

            try {
                setLoadingVehicle(true);
                const data = await searchVehicles(transporterId, vehicleQuery);
                setVehicles(data || []);
            } catch (err) {
                console.log("Vehicle search error:", err);
            } finally {
                setLoadingVehicle(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [vehicleQuery, transporterId]);

    // ================= VALIDATION =================
    const validate = () => {
        const newErrors: typeof errors = {};

        if (!selectedDriver) {
            newErrors.driver = "Please select a driver";
        }

        if (!selectedVehicle) {
            newErrors.vehicle = "Please select a vehicle";
        }

        if (!price) {
            newErrors.price = "Price is required";
        } else if (isNaN(Number(price))) {
            newErrors.price = "Enter a valid number";
        } else if (Number(price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ================= FORM VALID =================
    const isFormValid = useMemo(() => {
        return (
            selectedDriver &&
            selectedVehicle &&
            price &&
            !isNaN(Number(price)) &&
            Number(price) > 0
        );
    }, [selectedDriver, selectedVehicle, price]);

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setSubmitting(true);

            const payload = {
                transporter_id: transporterId,
                shipment_id: shipmentId,
                driver_id: selectedDriver._id,
                vehicle_id: selectedVehicle._id,
                bid_amount: Number(price),
            };

            const res = await createBid(payload);

            const socket = getSocket();
            socket?.emit("new_bid", res?.data);

            Alert.alert("Success", "Bid placed successfully");

            // Reset
            setSelectedDriver(null);
            setSelectedVehicle(null);
            setPrice("");
            setErrors({});

            navigation.goBack();

        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ================= UI =================
    return (
        <SafeAreaView className="flex-1 bg-white">
            <AppHeader
                text="Assign Vehicle & Driver"
                onpress={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                // contentContainerStyle={{  paddingBottom: 120 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                enableOnAndroid
                extraScrollHeight={120}      // extra space above keyboard
                enableAutomaticScroll
            >
                {/* <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={80}
            > */}
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item._id}
                    // keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16 }}

                    ListHeaderComponent={
                        <View>
                            {/* DRIVER */}
                            <Text className="font-bold mb-1">Search Driver</Text>
                            <TextInput
                                placeholder="Search driver..."
                                value={driverQuery}
                                onChangeText={(text) => {
                                    setDriverQuery(text);
                                }}
                                className="border p-3 rounded mb-2"
                            />

                            {loadingDriver && <ActivityIndicator />}

                            <FlatList
                                data={drivers}
                                keyExtractor={(item) => item._id}
                                scrollEnabled={false}
                                // keyboardShouldPersistTaps="handled"

                                renderItem={({ item }) => (
                                    <DriverItem
                                        item={item}
                                        selected={selectedDriver?._id === item._id}
                                        onSelect={() => {
                                            setSelectedDriver(item);
                                            setErrors((p) => ({ ...p, driver: undefined }));
                                        }}
                                        onRemove={() => setSelectedDriver(null)}
                                    />
                                )}
                            />

                            {errors.driver && (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.driver}
                                </Text>
                            )}

                            {/* VEHICLE */}
                            <Text className="font-bold mt-4 mb-1">
                                Search Vehicle
                            </Text>
                            <TextInput
                                placeholder="Search vehicle..."
                                value={vehicleQuery}
                                onChangeText={(text) => {
                                    setVehicleQuery(text);
                                }}
                                className="border p-3 rounded mb-2"
                            />

                            {loadingVehicle && <ActivityIndicator />}

                            {errors.vehicle && (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.vehicle}
                                </Text>
                            )}
                        </View>
                    }

                    renderItem={({ item }) => (
                        <VehicleItem
                            item={item}
                            selected={selectedVehicle?._id === item._id}
                            onSelect={() => {
                                setSelectedVehicle(item);
                                setErrors((p) => ({ ...p, vehicle: undefined }));
                            }}
                            onRemove={() => setSelectedVehicle(null)}
                        />
                    )}

                    ListFooterComponent={
                        <View>
                            {/* PRICE */}
                            <Text className="font-bold mt-4 mb-1">
                                Place your Price
                            </Text>
                            <TextInput
                                placeholder="Enter price"
                                value={price}
                                onChangeText={(text) => {
                                    setPrice(text);
                                    setErrors((p) => ({ ...p, price: undefined }));
                                }}
                                keyboardType="numeric"
                                className="border p-3 rounded"
                            />

                            {errors.price && (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.price}
                                </Text>
                            )}
                        </View>
                    }
                />

                {/* SUBMIT */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!isFormValid || submitting}
                    className={`m-4 p-4 rounded-xl items-center ${!isFormValid || submitting
                        ? "bg-gray-400"
                        : "bg-[#036BB4]"
                        }`}
                >
                    <Text className="text-white font-bold">
                        {submitting ? "Submitting..." : "Submit Bid"}
                    </Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
            {/* </KeyboardAvoidingView> */}
        </SafeAreaView >
    );
}