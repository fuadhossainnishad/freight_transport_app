// EarningsScreen.tsx
import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EarningsStackParamList } from "../../../navigation/types";
import { Earning } from "../types";
import BalanceCard from "../components/BalanceCard";
import EarningTable from "../components/EarningTable";

type NavigationProp = NativeStackNavigationProp<EarningsStackParamList, "Earning">;

const EarningsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const earnings = useMemo<Earning[]>(() => [
        { id: "1", title: "Furniture Delivery", amount: 200000, status: "PENDING", date: "Aug 15, 2023" },
        { id: "2", title: "Furniture Delivery", amount: 200000, status: "CONFIRMED", date: "Aug 14, 2023" },
        { id: "3", title: "Furniture Delivery", amount: 200000, status: "CONFIRMED", date: "Aug 13, 2023" },
    ], []);

    const balance = useMemo(() =>
        earnings
            .filter((e) => e.status === "CONFIRMED")
            .reduce((acc, cur) => acc + cur.amount, 0),
        [earnings]
    );

    return (
        <SafeAreaView className="flex-1 bg-white">

            {/* Header */}
            <View className="px-4 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-center text-gray-900">Earnings</Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerClassName=" pb-8"
                showsVerticalScrollIndicator={false}
            >
                {/* Balance Card */}
                <BalanceCard
                    balance={balance}
                    onWithdraw={() => navigation.navigate("Withdraw")}
                />

                <View className="px-4">
                    <EarningTable earnings={earnings} />
                </View>

            </ScrollView>

        </SafeAreaView>
    );
};

export default EarningsScreen;