// EarningsScreen.tsx
import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Wallet } from "lucide-react-native";
import { EarningsStackParamList } from "../../../navigation/types";
import { Earning } from "../types";
import BalanceCard from "../components/BalanceCard";
import EarningTable from "../components/EarningTable";

type NavigationProp = NativeStackNavigationProp<EarningsStackParamList, "Earning">;

const EarningsScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp>();

    // No earnings API endpoint exists yet. Render the real (empty) state instead
    // of fabricated rows; swap this for the API data once the endpoint is added.
    const earnings = useMemo<Earning[]>(() => [], []);

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
                <Text className="text-lg font-bold text-center text-gray-900">{t("earnings.title")}</Text>
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

        </SafeAreaView>
    );
};

export default EarningsScreen;
