import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";

const BG = require("../../../../assets/images/earning_bg.png");

interface Props {
    balance: number;
    onWithdraw: () => void;
}

const BalanceCard: React.FC<Props> = ({ balance, onWithdraw }) => {
    return (
        <ImageBackground
            source={BG}
            resizeMode="cover"
            className="mx-4 mt-4 rounded-2xl overflow-hidden"
        >
            <View className="p-5">
                <Text className="text-white text-sm opacity-80">Your Balance</Text>
                <Text className="text-white text-3xl font-bold mt-1">
                    ${balance.toLocaleString()}
                </Text>
                <TouchableOpacity
                    onPress={onWithdraw}
                    activeOpacity={0.85}
                    className="mt-4 bg-transparent rounded-full border border-white py-3 px-8 self-start"
                >
                    <Text className="text-white font-normal text-sm">Withdraw</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default BalanceCard;