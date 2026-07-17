import React, { useCallback, useEffect, useState } from "react";
import {
    ScrollView,
    TouchableOpacity,
    Text,
    Alert,
    View,
    ActivityIndicator,
} from "react-native";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Bank, BankPayload } from "../../../domain/entities/bank.entity";
import FormInput from "../../../shared/components/FormInput";
import SubmitButton from "../../../shared/components/SubmitButton";
import {
    addBankDetails,
    getBankDetails,
    updateBankDetails,
    deleteBankDetails,
} from "../../../domain/usecases/bank.usecases";
import AppHeader from "../../../shared/components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../app/context/Auth.context";
import { BankRole } from "../../../domain/constants/api";

type props = NativeStackNavigationProp<SettingsStackParamList, "Settings">;

const EMPTY: BankPayload = {
    account_number: "",
    routing_number: "",
    bank_name: "",
    bankholder_name: "",
    bank_address: "",
};

const InfoCard = ({ label, value }: { label: string; value?: string }) => (
    <View className="border border-gray-200 rounded-xl px-4 py-3 mb-4">
        <Text className="text-xs text-gray-500 mb-1">{label}</Text>
        <Text className="text-base font-semibold text-black">{value || "-"}</Text>
    </View>
);

const BankDetailsScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<props>();
    const { user } = useAuth();
    const role: BankRole = user?.role === "TRANSPORTER" ? "transporter" : "shipper";

    const [banks, setBanks] = useState<Bank[]>([]);
    const [mode, setMode] = useState<"view" | "form">("form");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { control, handleSubmit, reset } = useForm<BankPayload>({
        defaultValues: EMPTY,
    });

    const fetchBankDetails = useCallback(async () => {
        setLoading(true);
        const data = await getBankDetails(role);
        setBanks(data);
        setMode(data.length > 0 ? "view" : "form");
        setLoading(false);
    }, [role]);

    useEffect(() => {
        fetchBankDetails();
    }, [fetchBankDetails]);

    const startAdd = () => {
        setEditingId(null);
        reset(EMPTY);
        setMode("form");
    };

    const startEdit = (bank: Bank) => {
        setEditingId(bank._id ?? null);
        reset({
            account_number: bank.account_number,
            routing_number: bank.routing_number,
            bank_name: bank.bank_name,
            bankholder_name: bank.bankholder_name,
            bank_address: bank.bank_address,
        });
        setMode("form");
    };

    const onSubmit = async (formData: BankPayload) => {
        try {
            setSaving(true);
            if (editingId) {
                await updateBankDetails(role, editingId, formData);
                Alert.alert(t("common.success"), t("settings.bank.updated"));
            } else {
                await addBankDetails(role, formData);
                Alert.alert(t("common.success"), t("settings.bank.added"));
            }
            await fetchBankDetails();
        } catch (error: any) {
            Alert.alert(t("common.error"), error?.message || t("common.somethingWentWrong"));
        } finally {
            setSaving(false);
        }
    };

    const onDelete = (bank: Bank) => {
        if (!bank._id) return;
        Alert.alert(t("settings.bank.deleteTitle"), t("settings.bank.deleteMessage"), [
            { text: t("common.cancel"), style: "cancel" },
            {
                text: t("common.delete"),
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteBankDetails(role, bank._id!);
                        await fetchBankDetails();
                    } catch (e: any) {
                        Alert.alert(t("common.error"), e?.message || t("settings.bank.deleteFailed"));
                    }
                },
            },
        ]);
    };

    const handleBack = () => {
        // From the form, return to the list if accounts already exist.
        if (mode === "form" && banks.length > 0) {
            setMode("view");
            return;
        }
        navigation.goBack();
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
            <AppHeader text={t("settings.bank.title")} onpress={handleBack} />

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#036BB4" />
                </View>
            ) : mode === "view" ? (
                <ScrollView
                    className="px-4 bg-white flex-1"
                    contentContainerStyle={{ paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                >
                    {banks.map((bank, index) => (
                        <View key={bank._id ?? index} className="mt-2">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-lg font-bold text-black">
                                    {banks.length > 1
                                        ? t("settings.bank.accountNumbered", { number: index + 1 })
                                        : t("settings.bank.accountDetails")}
                                </Text>
                                <View className="flex-row items-center">
                                    <TouchableOpacity onPress={() => startEdit(bank)}>
                                        <Text className="text-[#036BB4] font-medium">{t("common.edit")}</Text>
                                    </TouchableOpacity>
                                    <Text className="text-gray-300 mx-2">|</Text>
                                    <TouchableOpacity onPress={() => onDelete(bank)}>
                                        <Text className="text-[#FF0702] font-medium">{t("common.delete")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <InfoCard label={t("settings.bank.accountNumberLabel")} value={bank.account_number} />
                            <InfoCard label={t("settings.bank.routingNumberLabel")} value={bank.routing_number} />
                            <InfoCard label={t("settings.bank.bankNameLabel")} value={bank.bank_name} />
                            <InfoCard label={t("settings.bank.holderNameLabel")} value={bank.bankholder_name} />
                            <InfoCard label={t("settings.bank.addressLabel")} value={bank.bank_address} />
                        </View>
                    ))}

                    <TouchableOpacity
                        onPress={startAdd}
                        className="bg-[#036BB4] p-4 rounded-full mt-2 flex-row items-center justify-center"
                    >
                        <View className="w-6 h-6 rounded-full border-2 border-white items-center justify-center mr-2">
                            <Text className="text-white text-base leading-5">+</Text>
                        </View>
                        <Text className="text-white text-center font-semibold">
                            {t("settings.bank.addAccount")}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <ScrollView
                    className="px-4 bg-white flex-1"
                    contentContainerStyle={{ paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="mt-2" />
                    <FormInput
                        control={control}
                        name="account_number"
                        label={t("settings.bank.accountNumberLabel")}
                        placeholder={t("settings.bank.accountNumberPlaceholder")}
                        rules={{ required: t("validation.accountNumberRequired") }}
                    />

                    <FormInput
                        control={control}
                        name="routing_number"
                        label={t("settings.bank.routingNumberLabel")}
                        placeholder={t("settings.bank.routingNumberPlaceholder")}
                        rules={{ required: t("validation.routingNumberRequired") }}
                    />

                    <FormInput
                        control={control}
                        name="bank_name"
                        label={t("settings.bank.bankNameLabel")}
                        placeholder={t("settings.bank.bankNamePlaceholder")}
                        rules={{ required: t("validation.bankNameRequired") }}
                    />

                    <FormInput
                        control={control}
                        name="bankholder_name"
                        label={t("settings.bank.holderNameLabel")}
                        placeholder={t("settings.bank.holderNamePlaceholder")}
                        rules={{ required: t("validation.holderNameRequired") }}
                    />

                    <FormInput
                        control={control}
                        name="bank_address"
                        label={t("settings.bank.addressLabel")}
                        placeholder={t("settings.bank.addressPlaceholder")}
                        rules={{ required: t("validation.bankAddressRequired") }}
                    />

                    <View className="mt-2">
                        <SubmitButton
                            text={editingId ? t("settings.bank.saveChange") : t("settings.bank.addAccount")}
                            loading={saving}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default BankDetailsScreen;
