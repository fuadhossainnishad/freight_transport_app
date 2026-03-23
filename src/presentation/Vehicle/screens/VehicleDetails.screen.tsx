import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { getVehicleById } from "../../../data/services/vehicleService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VehicleStackParamList } from "../../../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

type props = NativeStackNavigationProp<VehicleStackParamList, 'VehicleDetails'>;
type RoutePropType = RouteProp<VehicleStackParamList, 'ShipmentDetails'>;


const VehicleDetailsScreen = () => {
    const navigation = useNavigation<props>();
    const route = useRoute<RoutePropType>();
    const { vehicleId } = route.params;
    const [vehicle, setVehicle] = useState<any>(null);

    useEffect(() => {
        getVehicleById(id).then(setVehicle);
    }, []);

    if (!vehicle) return null;

    return (
        <ScrollView className="p-4">
            <Image
                source={{ uri: vehicle.images?.[0] }}
                className="w-full h-48 rounded-xl"
            />

            <Text className="text-xl font-bold mt-4">{vehicle.name}</Text>
            <Text>Plate: {vehicle.plateNumber}</Text>
            <Text>Type: {vehicle.type}</Text>
            <Text>Capacity: {vehicle.capacity}</Text>
            <Text>Year: {vehicle.modelYear}</Text>

            <Text className="mt-4 font-semibold">Documents</Text>

            {vehicle.documents?.map((doc) => (
                <Text key={doc.id}>{doc.type}</Text>
            ))}
        </ScrollView>
    );
};

export default VehicleDetailsScreen;