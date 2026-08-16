import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useTranslation } from "react-i18next";
import { History } from "lucide-react-native";

const BG = require("../../../../assets/images/earning_bg.png");

interface Props {
    balance: number;
    onWithdraw: () => void;
    onViewHistory: () => void;
}

const BalanceCard: React.FC<Props> = ({ balance, onWithdraw, onViewHistory }) => {
    const { t } = useTranslation();

    return (
        <ImageBackground
            source={BG}
            resizeMode="cover"
            className="mx-4 mt-4 rounded-2xl overflow-hidden"
        >
            <View className="p-5">
                <View className="flex-row items-start justify-between">
                    <View>
                        <Text className="text-white text-sm opacity-80">{t("earnings.balance.label")}</Text>
                        <Text className="text-white text-3xl font-bold mt-1">
                            ${balance.toLocaleString()}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={onViewHistory}
                        activeOpacity={0.8}
                        className="flex-row items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5"
                    >
                        <History size={14} color="#fff" />
                        <Text className="text-white text-xs font-semibold">
                            {t("earnings.balance.history")}
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={onWithdraw}
                    disabled={balance <= 0}
                    activeOpacity={0.85}
                    className={`mt-4 bg-transparent rounded-full border py-3 px-8 self-start ${balance <= 0 ? "border-white/40" : "border-white"}`}
                >
                    <Text className={`font-normal text-sm ${balance <= 0 ? "text-white/40" : "text-white"}`}>
                        {t("earnings.balance.withdraw")}
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default BalanceCard;
