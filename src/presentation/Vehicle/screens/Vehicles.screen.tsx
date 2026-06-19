import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Alert,
    RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Truck, Plus } from "lucide-react-native";
import { deleteVehicle, getVehicles } from "../../../data/services/vehicleService";
import { useAuth } from "../../../app/context/Auth.context";
import VehicleCard from "../components/VehicleCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VehicleStackParamList } from "../../../navigation/types";
import { Vehicle } from "../../../domain/entities/vehicle";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";

type props = NativeStackNavigationProp<VehicleStackParamList, "Vehicle">;

const PRIMARY = "#036BB4";

const VehiclesScreen = () => {
    const navigation = useNavigation<props>();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    const fetchVehicles = useCallback(async () => {
        try {
            const data = await getVehicles(user?.transporter_id!);
            setVehicles(data);
        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Failed to load your vehicles. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.transporter_id]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchVehicles);
        return unsubscribe;
    }, [navigation, fetchVehicles]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchVehicles();
    }, [fetchVehicles]);

    const handleDelete = (id: string) => {
        Alert.alert("Delete vehicle", "Are you sure you want to remove this vehicle?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteVehicle(id);
                        setVehicles((prev) => prev.filter((v) => v.id !== id));
                    } catch (err) {
                        Alert.alert("Error", "Failed to delete vehicle.");
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
            <AppHeader text="My Vehicles" onpress={() => navigation.goBack()} />

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={PRIMARY} />
                </View>
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 12 }}
                    contentContainerStyle={{
                        paddingTop: 8,
                        paddingBottom: 24,
                        paddingHorizontal: 16,
                        flexGrow: 1,
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />
                    }
                    renderItem={({ item }) => (
                        <View className="flex-1">
                            <VehicleCard
                                vehicle={item}
                                onView={() => navigation.navigate("VehicleDetails", { vehicleId: item.id })}
                                onEdit={() => navigation.navigate("UpdateVehicle", { vehicleId: item.id })}
                                onDelete={() => handleDelete(item.id)}
                            />
                        </View>
                    )}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center px-8 py-20">
                            <View className="w-20 h-20 rounded-full bg-[#036BB4]/10 items-center justify-center mb-4">
                                <Truck size={36} color={PRIMARY} strokeWidth={1.5} />
                            </View>
                            <Text className="text-base font-semibold text-gray-900">No vehicles yet</Text>
                            <Text className="text-sm text-gray-500 text-center mt-1.5 leading-5">
                                Add your first vehicle to start receiving and managing shipment bids.
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Add vehicle CTA */}
            <View className="px-4 pt-2 pb-4 bg-gray-50">
                <TouchableOpacity
                    className="py-4 rounded-full flex-row gap-2 items-center justify-center"
                    style={{ backgroundColor: PRIMARY }}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("AddVehicle")}
                >
                    <Plus size={20} color="#fff" strokeWidth={2.5} />
                    <Text className="text-white text-center font-semibold text-base">Add Vehicle</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default VehiclesScreen;
