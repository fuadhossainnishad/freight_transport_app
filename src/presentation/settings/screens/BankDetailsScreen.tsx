import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, Text, Alert, View } from "react-native";
import { useForm } from "react-hook-form";
import { Bank } from "../../../domain/entities/bank.entity";
import FormInput from "../../../shared/components/FormInput";
import { addBankDetails, getBankDetails, updateBankDetails } from "../../../domain/usecases/bank.usecases";
import AppHeader from "../../../shared/components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";


type props = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;


const BankDetailsScreen = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<props>()

    const { control, handleSubmit, reset } = useForm<Bank>({
        defaultValues: {
            accountNumber: "",
            routingNumber: "",
            bankName: "",
            holderName: "",
            bankAddress: "",
        },
    });

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const fetchBankDetails = async () => {
        setLoading(true);
        const data = await getBankDetails();
        if (data) reset(data); // populate form if bank details exist
        setLoading(false);
    };

    const onSubmit = async (formData: Bank) => {
        try {
            setLoading(true);
            const existingBank = await getBankDetails();
            if (!existingBank) {
                await addBankDetails(formData);
                Alert.alert("Success", "Bank details added successfully!");
            } else {
                await updateBankDetails(formData);
                Alert.alert("Success", "Bank details updated successfully!");
            }
        } catch (error) {
            Alert.alert("Error", (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">

            <AppHeader text="Bank Details" onpress={() => navigation.goBack()} />

            <ScrollView className="p-4 bg-white flex-1">
                <FormInput
                    control={control}
                    name="accountNumber"
                    label="Account Number"
                    placeholder="Enter your account number"
                    rules={{ required: "Account number is required" }}
                />

                <FormInput
                    control={control}
                    name="routingNumber"
                    label="Routing Number"
                    placeholder="Enter your routing number"
                    rules={{ required: "Routing number is required" }}
                />

                <FormInput
                    control={control}
                    name="bankName"
                    label="Bank Name"
                    placeholder="Enter bank name"
                    rules={{ required: "Bank name is required" }}
                />

                <FormInput
                    control={control}
                    name="holderName"
                    label="Bank Holder Name"
                    placeholder="Enter bank holder name"
                    rules={{ required: "Holder name is required" }}
                />

                <FormInput
                    control={control}
                    name="bankAddress"
                    label="Bank Address"
                    placeholder="Enter bank address"
                    rules={{ required: "Bank address is required" }}
                />

                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    className="bg-blue-600 py-3 rounded-lg mt-6 items-center"
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">{loading ? "Saving..." : "Save & Change"}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default BankDetailsScreen;