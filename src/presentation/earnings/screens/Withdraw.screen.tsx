import React, { useState } from "react";
import {
    Text, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform,
    View, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AppHeader from "../../../shared/components/AppHeader";
import FormInput from "../components/FormInput";
import CountryPickerModal from "../components/CountryPickerModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { EarningsStackParamList } from "../../../navigation/types";

import ArrowIcon from "../../../../assets/icons/arrow_down.svg"

type NavigationProp = NativeStackNavigationProp<EarningsStackParamList, "Withdraw">;

const WithdrawScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp>();

    const [amount, setAmount] = useState("");
    const [countryName, setCountryName] = useState("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = (): string | null => {
        if (!amount.trim()) return t("validation.amountRequired");
        if (isNaN(Number(amount)) || Number(amount) <= 0) return t("validation.amountInvalid");
        if (!countryName) return t("validation.regionRequired");
        return null;
    };

    const handleSubmit = async () => {
        const error = validate();
        if (error) { Alert.alert(t("validation.validationError"), error); return; }
        try {
            setLoading(true);
            console.log("Withdraw payload:", { amount, region: countryName });
            Alert.alert(t("common.success"), t("earnings.withdraw.requestSubmitted"));
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert(t("common.error"), t("common.tryAgain"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <AppHeader text={t("earnings.withdraw.title")} onpress={() => navigation.goBack()} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="px-4 pt-6 pb-10"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Amount */}
                    <FormInput
                        label={t("earnings.withdraw.amountLabel")}
                        value={amount}
                        placeholder={t("earnings.withdraw.amountPlaceholder")}
                        keyboardType="numeric"
                        onChange={setAmount}
                    />

                    {/* Region */}
                    <View className="mb-4">
                        <Text className="text-gray-600 mb-2">{t("earnings.withdraw.regionLabel")}</Text>
                        <TouchableOpacity
                            onPress={() => setPickerOpen(true)}
                            activeOpacity={0.75}
                            className="flex-row items-center border border-gray-200 rounded-xl bg-gray-50 px-4 py-4"
                        >
                            <Text className={`flex-1 text-base ${countryName ? "text-gray-800" : "text-gray-400"}`}>
                                {countryName || t("earnings.withdraw.regionPlaceholder")}
                            </Text>
                            <ArrowIcon height={24} width={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.85}
                        className={`mt-4 rounded-full py-4 items-center justify-center ${loading ? "bg-gray-300" : "bg-[#036BB4]"
                            }`}
                    >
                        <Text className="text-white font-bold text-base">
                            {loading ? t("common.submitting") : t("earnings.withdraw.submitRequest")}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Country Picker */}
            <CountryPickerModal
                visible={pickerOpen}
                selected={countryName}
                onSelect={(country) => {
                    setCountryName(country);
                    setPickerOpen(false);
                }}
                onClose={() => setPickerOpen(false)}
            />

        </SafeAreaView>
    );
};

export default WithdrawScreen;