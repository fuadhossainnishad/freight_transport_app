import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, PackageSearch } from "lucide-react-native";
import { getAvailableBids } from "../../../data/services/bidService";
import BidCard from "../../../shared/components/BidCard";
import { AvailableBidsStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type props = NativeStackNavigationProp<AvailableBidsStackParamList, 'AvailableBids'>;

const BLUE = "#036BB4";
const H_PADDING = 16;
const GAP = 12;
const CARD_W = (Dimensions.get("window").width - H_PADDING * 2 - GAP) / 2;

export default function AvailableBidsScreen() {
    const navigation = useNavigation<props>()

    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    const fetchBids = useCallback(async () => {
        try {
            const res = await getAvailableBids();
            setBids(res?.data ?? []);
        } catch (error) {
            console.log("Bid fetch error:", error);
            setBids([]);
        }
    }, []);

    useEffect(() => {
        fetchBids().finally(() => setLoading(false));
    }, [fetchBids]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchBids();
        setRefreshing(false);
    }, [fetchBids]);

    // Client-side filtering (the backend feed ignores the search term).
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return bids;
        return bids.filter((b) =>
            [b?.shipment_title, b?.category, b?.pickup_address, b?.delivery_address]
                .filter(Boolean)
                .some((f: string) => f.toLowerCase().includes(q))
        );
    }, [bids, search]);

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F9FB]">
            {/* Header */}
            <View className="px-4 pt-3 pb-2 bg-[#F7F9FB]">
                <Text className="text-xl font-extrabold text-[#0F172A]">Available Bids</Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                    Browse open shipments and place your bid
                </Text>

                {/* Search */}
                <View className="flex-row items-center bg-white rounded-2xl px-3.5 mt-4 border border-gray-200"
                    style={{ height: 48 }}>
                    <Search size={18} color="#94A3B8" />
                    <TextInput
                        placeholder="Search by title or location"
                        placeholderTextColor="#9AA0A6"
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                        className="flex-1 ml-2 text-[15px] text-gray-900"
                        style={{ paddingVertical: 0 }}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")} hitSlop={8}>
                            <X size={18} color="#9AA0A6" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* List */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={BLUE} />
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{ gap: GAP, paddingHorizontal: H_PADDING }}
                    contentContainerStyle={{ paddingTop: 12, paddingBottom: 28, gap: GAP }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[BLUE]} tintColor={BLUE} />
                    }
                    renderItem={({ item }) => (
                        <BidCard
                            bid={item}
                            width={CARD_W}
                            onPress={() => navigation.navigate('ShipmentDetails', { shipmentId: item._id })}
                        />
                    )}
                    ListEmptyComponent={
                        <View className="items-center mt-24 px-10">
                            <View className="w-16 h-16 rounded-full bg-[#EAF2FB] items-center justify-center mb-4">
                                <PackageSearch size={30} color={BLUE} />
                            </View>
                            <Text className="text-base font-bold text-gray-800">
                                {search ? "No matching bids" : "No bids available"}
                            </Text>
                            <Text className="text-sm text-gray-500 text-center mt-1.5 leading-5">
                                {search
                                    ? "Try a different shipment title or location."
                                    : "New open shipments will appear here. Pull down to refresh."}
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
