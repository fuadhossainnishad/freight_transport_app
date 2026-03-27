import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { deleteVehicle, getVehicles } from "../../../data/services/vehicleService";
import { useAuth } from "../../../app/context/Auth.context";
import VehicleCard from "../components/VehicleCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VehicleStackParamList } from "../../../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";
import AddIcon from "../../../../assets/icons/add.svg"

type props = NativeStackNavigationProp<VehicleStackParamList, 'Vehicle'>;


const VehiclesScreen = () => {
    const navigation = useNavigation<props>();
    const [vehicles, setVehicles] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth()

    const fetchVehicles = async () => {
        try {
            const data = await getVehicles(user?.transporter_id!);
            console.log("getVehicles from vehiclescreen:", data)
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
        <SafeAreaView
            edges={["top"]}
            className="flex-1  bg-white">

            <AppHeader text="My Vehicles" onpress={() => navigation.goBack()} />

            <FlatList
                data={vehicles}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
                renderItem={({ item }) => (
                    <View style={{ width: "48%" }}>
                        <VehicleCard
                            vehicle={item}
                            onView={() => navigation.navigate("VehicleDetails", { vehicleId: item.id })}
                            onEdit={() => navigation.navigate('UpdateVehicle', { vehicleId: item.id })}
                            onDelete={() => handleDelete(item.id)}
                        />
                    </View>
                )}
            />

            <TouchableOpacity
                className="p-3 rounded-xl m-4 flex-row gap-3 items-center justify-center border border-[#036BB4]"
                onPress={() => navigation.navigate('AddVehicle')}
            >
                <AddIcon height={24} width={24} />
                <Text className="text-[#036BB4] text-center font-semibold">
                    Add Vehicle
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default VehiclesScreen;