import React from "react";
import {
    View,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation()
    const navigation = useNavigation<props>()
    const { changePassword, loading } = useChangePassword();

    const {
        control,
        handleSubmit,

    } = useForm<ChangePassword>({
        defaultValues: {
            current_pasword: "",
            new_pasword: "",
            confirmed_pasword: "",
        },
    });

    const onSubmit = async (data: ChangePassword) => {
        try {

            await changePassword(data);

            Alert.alert(
                t("common.success"),
                t("settings.changePassword.success")
            );

        } catch {
            Alert.alert(
                t("common.error"),
                t("settings.changePassword.changeFailed")
            );
        }
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">

            <AppHeader text={t("settings.changePassword.title")} onpress={() => navigation.goBack()} />

            <View className="p-4">

                <FormInput
                    control={control}
                    name="current_pasword"
                    label={t("settings.changePassword.currentLabel")}
                    placeholder={t("settings.changePassword.currentPlaceholder")}
                    rules={{ required: t("validation.currentPasswordRequired") }}
                />

                <FormInput
                    control={control}
                    name="new_pasword"
                    label={t("settings.changePassword.newLabel")}
                    placeholder={t("settings.changePassword.newPlaceholder")}
                    rules={{
                        required: t("validation.newPasswordRequiredShort"),
                    }}
                />

                <FormInput
                    control={control}
                    name="confirmed_pasword"
                    label={t("settings.changePassword.confirmLabel")}
                    placeholder={t("settings.changePassword.confirmPlaceholder")}
                    rules={{ required: t("validation.confirmedPasswordRequired") }}
                />


                <SubmitButton
                    text={t("settings.profile.save")}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                />

            </View>

        </SafeAreaView>
    );
}