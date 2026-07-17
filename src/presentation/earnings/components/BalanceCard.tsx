import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useTranslation } from "react-i18next";

const BG = require("../../../../assets/images/earning_bg.png");

interface Props {
    balance: number;
    onWithdraw: () => void;
}

const BalanceCard: React.FC<Props> = ({ balance, onWithdraw }) => {
    const { t } = useTranslation();

    return (
        <ImageBackground
            source={BG}
            resizeMode="cover"
            className="mx-4 mt-4 rounded-2xl overflow-hidden"
        >
            <View className="p-5">
                <Text className="text-white text-sm opacity-80">{t("earnings.balance.label")}</Text>
                <Text className="text-white text-3xl font-bold mt-1">
                    ${balance.toLocaleString()}
                </Text>
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
