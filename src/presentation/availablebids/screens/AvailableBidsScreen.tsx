import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    ActivityIndicator
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { getAvailableBids } from "../../../data/services/bidService";
import BidCard from "../../../shared/components/BidCard";
import { DUMMY_BIDS } from "../dummy";
import { AvailableBidsStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type props = NativeStackNavigationProp<AvailableBidsStackParamList, 'AvailableBids'>;


export default function AvailableBidsScreen() {
    const navigation = useNavigation<props>()

    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchBids = async () => {
        try {
            setLoading(true);

            const res = await getAvailableBids(search);

            const apiBids = res?.data ?? [];

            // fallback to dummy data if API returns empty
            setBids(apiBids.length ? apiBids : DUMMY_BIDS);

        } catch (error) {
            console.log("Bid fetch error:", error);

            // fallback to dummy data on error
            setBids(DUMMY_BIDS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">

            <View className="px-5 pt-4 mb-28">

                {/* Header */}
                <Text className="text-xl font-bold mb-4">
                    Available Bids
                </Text>

                {/* Search */}
                <TextInput
                    placeholder="Search bids..."
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={fetchBids}
                    className="border border-gray-300 rounded-xl px-4 py-3 mb-5"
                />

                {/* List */}
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <FlatList
                        data={bids}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={{
                            justifyContent: "space-between",
                        }}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <BidCard bid={item} onPress={() => navigation.navigate('ShipmentDetails', { shipmentId: item._id })} />
                        )}
                        ListEmptyComponent={
                            <View className="items-center mt-20">
                                <Text className="text-gray-500">
                                    No bids available
                                </Text>
                            </View>
                        }
                    />
                )}

            </View>

        </SafeAreaView>
    );
}