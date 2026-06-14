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
                Alert.alert("Success", "Bank details updated successfully!");
            } else {
                await addBankDetails(role, formData);
                Alert.alert("Success", "Bank details added successfully!");
            }
            await fetchBankDetails();
        } catch (error: any) {
            Alert.alert("Error", error?.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const onDelete = (bank: Bank) => {
        if (!bank._id) return;
        Alert.alert("Delete account", "Remove this bank account?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteBankDetails(role, bank._id!);
                        await fetchBankDetails();
                    } catch (e: any) {
                        Alert.alert("Error", e?.message || "Failed to delete");
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
            <AppHeader text="Bank Details" onpress={handleBack} />

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
                                    {banks.length > 1 ? `Account ${index + 1}` : "Account Details"}
                                </Text>
                                <View className="flex-row items-center">
                                    <TouchableOpacity onPress={() => startEdit(bank)}>
                                        <Text className="text-[#036BB4] font-medium">Edit</Text>
                                    </TouchableOpacity>
                                    <Text className="text-gray-300 mx-2">|</Text>
                                    <TouchableOpacity onPress={() => onDelete(bank)}>
                                        <Text className="text-[#FF0702] font-medium">Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <InfoCard label="Account Number" value={bank.account_number} />
                            <InfoCard label="Routing Number" value={bank.routing_number} />
                            <InfoCard label="Bank Name" value={bank.bank_name} />
                            <InfoCard label="Bank holder Name" value={bank.bankholder_name} />
                            <InfoCard label="Bank Adress" value={bank.bank_address} />
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
                            Add Account
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
                        label="Account Number"
                        placeholder="Enter your account number"
                        rules={{ required: "Account number is required" }}
                    />

                    <FormInput
                        control={control}
                        name="routing_number"
                        label="Routing Number"
                        placeholder="Enter your routing number"
                        rules={{ required: "Routing number is required" }}
                    />

                    <FormInput
                        control={control}
                        name="bank_name"
                        label="Bank Name"
                        placeholder="Enter bank name"
                        rules={{ required: "Bank name is required" }}
                    />

                    <FormInput
                        control={control}
                        name="bankholder_name"
                        label="Bank holder Name"
                        placeholder="Enter bank holder name"
                        rules={{ required: "Holder name is required" }}
                    />

                    <FormInput
                        control={control}
                        name="bank_address"
                        label="Bank Adress"
                        placeholder="Enter bank address"
                        rules={{ required: "Bank address is required" }}
                    />

                    <View className="mt-2">
                        <SubmitButton
                            text={editingId ? "Save & Change" : "Add Account"}
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
