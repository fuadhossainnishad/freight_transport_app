import React from "react";
import {
    View,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import FormInput from "../../../shared/components/FormInput";
import AppHeader from "../../../shared/components/AppHeader";
import { ChangePassword } from "../../../domain/entities/user.entity";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../../../navigation/types";
import SubmitButton from "../../../shared/components/SubmitButton";
import { useChangePassword } from "../hooks/useChangePassword";

type props = NativeStackNavigationProp<SettingsStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen() {
    const navigation = useNavigation<props>()
    const { changePassword, loading } = useChangePassword();

    const {
        control,
        handleSubmit,

    } = useForm<ChangePassword>({
        defaultValues: {
            current_pasword: "Sunan Rahman",
            new_pasword: "demo@gmail.com",
            confirmed_pasword: "+99007007007",
        },
    });

    const onSubmit = async (data: ChangePassword) => {
        try {

            await changePassword(data);

            Alert.alert(
                "Success",
                "Profile updated successfully"
            );

        } catch {
            Alert.alert(
                "Error",
                "Failed to update profile"
            );
        }
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">

            <AppHeader text="Edit Profile" onpress={() => navigation.goBack()} />

            <View className="p-4">

                <FormInput
                    control={control}
                    name="current_pasword"
                    label="Current Password"
                    placeholder="Enter Current Password"
                    rules={{ required: "Current Password is required" }}
                />

                <FormInput
                    control={control}
                    name="new_pasword"
                    label="New Password"
                    placeholder="Enter New Password"
                    rules={{
                        required: "New Password is required",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Invalid email",
                        },
                    }}
                />

                <FormInput
                    control={control}
                    name="confirmed_pasword"
                    label="Confirmed Password"
                    placeholder="Enter Confirmed Password"
                    rules={{ required: "Confirmed Password required" }}
                />


                <SubmitButton
                    text="Save & Change"
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                />

            </View>

        </SafeAreaView>
    );
}