// EarningsScreen.tsx
import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Wallet } from "lucide-react-native";
import { EarningsStackParamList } from "../../../navigation/types";
import { Earning, mapEarning } from "../types";
import { getMyEarnings } from "../../../data/services/earningService";
import { getWithdrawalBalance } from "../../../data/services/withdrawalService";
import BalanceCard from "../components/BalanceCard";
import EarningTable from "../components/EarningTable";

type NavigationProp = NativeStackNavigationProp<EarningsStackParamList, "Earning">;

const EarningsScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp>();

    const [earnings, setEarnings] = useState<Earning[]>([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const [earningsRes, balanceRes] = await Promise.all([
                getMyEarnings(1, 20),
                getWithdrawalBalance(),
            ]);
            setEarnings(earningsRes.data.map(mapEarning));
            setBalance(balanceRes.available_balance);
        } catch (err) {
            console.error("Failed to load earnings:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Refresh whenever the tab regains focus — e.g. after submitting a withdraw
    // request, the available balance should reflect it immediately.
    useFocusEffect(useCallback(() => { load(); }, [load]));

    return (
        <SafeAreaView className="flex-1 bg-white">

            {/* Header */}
            <View className="px-4 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-center text-gray-900">{t("earnings.title")}</Text>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#036BB4" />
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    contentContainerClassName=" pb-8"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={["#036BB4"]} tintColor="#036BB4" />
                    }
                >
                    {/* Balance Card */}
                    <BalanceCard
                        balance={balance}
                        onWithdraw={() => navigation.navigate("Withdraw")}
                        onViewHistory={() => navigation.navigate("WithdrawalHistory")}
                    />

                    {earnings.length === 0 ? (
                        <View className="items-center justify-center px-8 mt-16">
                            <View className="w-20 h-20 rounded-full bg-[#E8F2FB] items-center justify-center">
                                <Wallet size={36} color="#036BB4" />
                            </View>
                            <Text className="text-lg font-semibold text-gray-900 mt-5">
                                {t("earnings.emptyTitle")}
                            </Text>
                            <Text className="text-sm text-gray-500 text-center mt-2 leading-5">
                                {t("earnings.emptyBody")}
                            </Text>
                        </View>
                    ) : (
                        <View className="px-4">
                            <EarningTable earnings={earnings} />
                        </View>
                    )}
                </ScrollView>
            )}

        </SafeAreaView>
    );
};

export default EarningsScreen;
