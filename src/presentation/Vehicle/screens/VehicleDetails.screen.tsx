import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, ScrollView, FlatList, Dimensions, TouchableOpacity, Linking } from "react-native";
import { getVehicleById } from "../../../data/services/vehicleService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VehicleStackParamList } from "../../../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import AppHeader from "../../../shared/components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import VehicleDetailsDataCard from "../components/VehicleDetailsDataCard";
import { Vehicle, VehicleDocument } from "../../../domain/entities/vehicle";

const { width } = Dimensions.get("window");

type props = NativeStackNavigationProp<VehicleStackParamList, 'VehicleDetails'>;
type RoutePropType = RouteProp<VehicleStackParamList, 'VehicleDetails'>;

const VehicleDetailsScreen = () => {
    const navigation = useNavigation<props>();
    const route = useRoute<RoutePropType>();
    const { vehicleId } = route.params;
    const [vehicle, setVehicle] = useState<Vehicle>();

    useEffect(() => {
        getVehicleById(vehicleId!).then(setVehicle);
    }, [vehicleId]);

    if (!vehicle) return null;

    const documentSections = useMemo(() => {
        const groups: Record<string, VehicleDocument[]> = {
            plateId: [],
            insurance: [],
            technicalVisit: [],
            registration: [],
        };

        vehicle.documents.forEach((doc) => {
            if (groups[doc.type]) groups[doc.type].push(doc);
        });

        return [
            { label: "Plate ID", files: groups.plateId },
            { label: "Insurance", files: groups.insurance },
            { label: "Technical Visit", files: groups.technicalVisit },
            { label: "Registration", files: groups.registration },
        ];
    }, [vehicle.documents]);

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
            <AppHeader text="Vehicle Details" onpress={() => navigation.goBack()} />

            <ScrollView className="px-4 py-4 space-y-4">

                {/* Vehicle Image Carousel */}
                {vehicle.images?.length > 0 && (
                    <FlatList
                        data={vehicle.images}
                        horizontal
                        pagingEnabled
                        keyExtractor={(_, index) => `vehicle-image-${index}`}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item }}
                                style={{ width: width - 32, height: 220, borderRadius: 12, marginRight: 8 }}
                                resizeMode="cover"
                            />
                        )}
                    />
                )}

                <Text className="text-black text-lg font-semibold mt-4 mb-2">Vehicle Details</Text>

                {/* Vehicle Details Grid */}
                <View className="flex-row flex-wrap justify-between gap-2">
                    <VehicleDetailsDataCard label="Vehicle Name" data={vehicle.name} />
                    <VehicleDetailsDataCard label="Plate Number" data={vehicle.plateNumber} />
                    <VehicleDetailsDataCard label="Vehicle Type" data={vehicle.type} />
                    <VehicleDetailsDataCard label="Capacity" data={vehicle.capacity} />
                    <VehicleDetailsDataCard label="Year / Model" data={vehicle.modelYear} fullWidth />
                </View>

                {/* Documents Section */}
                {documentSections.map((section) =>
                    section.files.length > 0 ? (
                        <View key={section.label} className="mt-4 space-y-2">
                            <Text className="text-black text-lg font-semibold mb-2">{section.label}</Text>
                            <FlatList
                                data={section.files}
                                horizontal
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(item.url)}
                                        className="mr-2 border border-gray-200 rounded-xl overflow-hidden"
                                    >
                                        <Image
                                            source={{ uri: item.url }}
                                            style={{ width: 100, height: 100 }}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    ) : null
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default VehicleDetailsScreen;