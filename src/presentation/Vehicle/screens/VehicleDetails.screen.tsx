import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, ScrollView, FlatList, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { deleteVehicle, getVehicleById } from "../../../data/services/vehicleService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VehicleStackParamList } from "../../../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import AppHeader from "../../../shared/components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import VehicleDetailsDataCard from "../components/VehicleDetailsDataCard";
import { Vehicle, VehicleDocument } from "../../../domain/entities/vehicle";
import DocumentGrid from "../components/DocumentGrid";
import DocsPreviewModal from "../components/DocsPreviewModal";
import EditIcon from "../../../../assets/icons/edit3.svg"
import DeleteIcon from "../../../../assets/icons/delete.svg"


const { width } = Dimensions.get("window");

type props = NativeStackNavigationProp<VehicleStackParamList, 'VehicleDetails'>;
type RoutePropType = RouteProp<VehicleStackParamList, 'VehicleDetails'>;

const VehicleDetailsScreen = () => {
    const navigation = useNavigation<props>();
    const route = useRoute<RoutePropType>();
    const { vehicleId } = route.params;
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [previewUri, setPreviewUri] = useState<string | null>(null);
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

    const handleEdit = () => {
        navigation.navigate("UpdateVehicle", { vehicleId });
    };

    const handleDelete = () => {
        Alert.alert("Confirm", "Are you sure you want to delete this vehicle?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: confirmDelete,
            },
        ]);
    };

    const confirmDelete = async () => {
        try {
            setDeleting(true);
            await deleteVehicle(vehicleId);

            Alert.alert("Success", "Vehicle removed successfully");
            navigation.goBack(); // 🔥 important
        } catch (err) {
            Alert.alert("Error", "Failed to delete vehicle");
        } finally {
            setDeleting(false);
        }
    };

    const documentSections = useMemo(() => {
        if (!vehicle) return null;

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
    }, [vehicle]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#036BB4" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
            <AppHeader text="Vehicle Details" onpress={() => navigation.goBack()} />

            <ScrollView className="px-4 py-4 space-y-4">

                {/* Vehicle Image Carousel */}
                {vehicle?.images?.length! > 0 && (
                    <FlatList
                        data={vehicle?.images}
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
                    <VehicleDetailsDataCard label="Vehicle Name" data={vehicle?.name!} />
                    <VehicleDetailsDataCard label="Plate Number" data={vehicle?.plateNumber!} />
                    <VehicleDetailsDataCard label="Vehicle Type" data={vehicle?.type!} />
                    <VehicleDetailsDataCard label="Capacity" data={vehicle?.capacity!} />
                    <VehicleDetailsDataCard label="Year / Model" data={vehicle?.modelYear!} fullWidth />
                </View>

                {/* Documents Section */}
                <View className="flex-row flex-wrap justify-between mt-4">
                    {documentSections?.map((section, index) => {
                        const isLast = index === documentSections.length - 1;

                        return section.files.length > 0 ? (
                            <DocumentGrid
                                key={section.label}
                                title={section.label}
                                documents={section.files}
                                onPreview={setPreviewUri}
                                fullWidth={isLast}
                            />
                        ) : null;
                    })}
                </View>

                <View className="flex-row gap-3 mb-6">
                    <TouchableOpacity
                        onPress={handleEdit}
                        className="flex-1 border border-[#036BB4] py-3 rounded-full flex-row justify-center items-center gap-2"
                    >
                        <EditIcon height={18} width={18} />
                        <Text className="font-medium  text-[#036BB4]">Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleDelete}
                        disabled={deleting}
                        className="flex-1 border border-[#FF0000] py-3 rounded-full flex-row justify-center items-center gap-2 text-[#FF0000]"
                    >
                        {deleting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <DeleteIcon height={18} width={18} />
                                <Text className="font-semibold text-[#FF0000]">Remove</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <DocsPreviewModal
                visible={!!previewUri}
                imageUri={previewUri!}
                onClose={() => setPreviewUri(null)}
            />
        </SafeAreaView>
    );
};

export default VehicleDetailsScreen;