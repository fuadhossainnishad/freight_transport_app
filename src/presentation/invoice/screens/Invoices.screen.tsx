import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { InvoiceStackParamList } from "../../../navigation/types";
import { mapShipments, Shipment } from "../../../domain/entities/shipment.entity";
import { useAuth } from "../../../app/context/Auth.context";
import { getShipmentsUseCase } from "../../../domain/usecases/shipment.usecase";
import ShipmentTable from "../components/InvoiceTable";
import { SearchInput } from "../../settings/components/SearchInput";
import { DUMMY_SHIPMENTS } from "../dummy";

type Props = NativeStackNavigationProp<
    InvoiceStackParamList,
    "Invoices"
>;

const InvoicesScreen = () => {
    const navigation = useNavigation<Props>();
    const { user } = useAuth();

    const [shipments, setShipments] = useState<Shipment[]>(mapShipments(DUMMY_SHIPMENTS));
    const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const loadActiveShipments = async () => {
        const role = user?.role.toLocaleLowerCase();
        const id = user?.role === "TRANSPORTER" ? user.transporter_id : user?.shipper_id;
        try {
            setLoading(true);

            const { shipments: activeShipments } = await getShipmentsUseCase(role!, id!);
            console.log("activeShipments:", activeShipments)

            const applyShipments =
                activeShipments.length > 0
                    ? activeShipments
                    : mapShipments(DUMMY_SHIPMENTS);

            setShipments(applyShipments);
            setFilteredShipments(applyShipments);
        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error.message || "Failed to load shipments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActiveShipments();
    }, []);

    // Filter by search
    useEffect(() => {
        if (!search.trim()) {
            setFilteredShipments(shipments);
        } else {
            setFilteredShipments(
                shipments.filter((s) =>
                    s.title.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, shipments]);

    const handleView = (shipment: Shipment) => {
        navigation.navigate("InvoiceDetails");

        // Alert.alert(
        //     "Shipment Details",
        //     `Title: ${shipment.title}\n\n${shipment.description}\n\nStatus: ${shipment.status ? "Delivered" : "In Progress"
        //     }`
        // );
    };

    const handleMap = (shipment: Shipment) => {
        navigation.navigate('ShipmentTracking', { shipmentId: shipment.id! });

        // Alert.alert("Confirm Delete", "Delete this shipment?", [
        //     { text: "Cancel", style: "cancel" },
        //     {
        //         text: "Delete",
        //         style: "destructive",
        //         onPress: () =>
        //             setShipments((prev) =>
        //                 prev.filter((s) => s.id !== shipment.id)
        //             ),
        //     },
        // ]);
    };

    // const handleCreateShipment = () => {
    //     navigation.navigate("CreateShipment");
    // };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white p-4">
            <View className='bg-white flex-row w-full p-4  items-center px-4'>
                <Text className='text-center text-lg font-semibold text-black w-full'>
                    Active Shipments
                </Text>
            </View>

            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search shipment"
            />

            <ShipmentTable
                shipments={filteredShipments}
                onView={handleView}
                onMap={handleMap}
            />
            {/* <View className="absolute bottom-4 left-0 right-0 px-4">
                <TouchableOpacity
                    onPress={handleCreateShipment}
                    className="bg-[#036BB4] py-4 rounded-full items-center justify-center shadow-lg"
                >
                    <Text className="text-white font-semibold text-lg">Create Shipment</Text>
                </TouchableOpacity>
            </View> */}
        </SafeAreaView>
    );
};

export default InvoicesScreen;