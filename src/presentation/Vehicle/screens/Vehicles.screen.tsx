import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { deleteVehicle, getVehicles } from "../../../data/services/vehicleService";
import { useAuth } from "../../../app/context/Auth.context";
import VehicleCard from "../components/VehicleCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VehicleStackParamList } from "../../../navigation/types";

type props = NativeStackNavigationProp<VehicleStackParamList, 'Vehicle'>;


const VehiclesScreen = () => {
    const navigation = useNavigation<props>();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth()

    const fetchVehicles = async () => {
        try {
            const data = await getVehicles(user?.transporter_id!);
            console.log("getVehicles:", data)
            setVehicles(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteVehicle(id);
        setVehicles(prev => prev.filter(v => v.id !== id));
    };

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <View className="flex-1 p-4">
            <FlatList
                data={vehicles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <VehicleCard
                        vehicle={item}
                        onView={() => navigation.navigate("VehicleDetails", { vehicleId: item.id })}
                        onEdit={() => navigation.navigate('UpdateVehicle', { vehicleId: item.id })}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
            />

            <TouchableOpacity
                className="bg-black p-4 rounded-xl mt-4"
                onPress={() => navigation.navigate('AddVehicle')}
            >
                <Text className="text-white text-center font-semibold">
                    Add Vehicle
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default VehiclesScreen;