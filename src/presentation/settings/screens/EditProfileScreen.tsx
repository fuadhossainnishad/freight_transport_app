import React, { useEffect } from "react";
import {
    View,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormInput from "../../../shared/components/FormInput";
import AppHeader from "../../../shared/components/AppHeader";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useProfile } from "../hooks/useProfile";
import { UserProfile } from "../../../domain/entities/user.entity";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../../../navigation/types";
import SubmitButton from "../../../shared/components/SubmitButton";
import ProfileImagePicker from "../../../shared/components/ProfileImagePicker";

type props = NativeStackNavigationProp<SettingsStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
    const { t } = useTranslation()
    const navigation = useNavigation<props>()
    const { updateProfile, loading } = useUpdateProfile();
    const { profile, loading: profileLoading } = useProfile();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
    } = useForm<UserProfile>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            avatar: null
        },
    });
    const avatar = watch("avatar");

    useEffect(() => {
        if (!profile) return;

        reset({
            name: profile.company_name ?? "",
            email: profile.email ?? "",
            phone: profile.phone ?? "",
            avatar: profile.logo
                ? { uri: profile.logo, name: "avatar", type: "image/jpeg" }
                : null,
        });
    }, [profile, reset]);

    const onSubmit = async (data: UserProfile) => {
        try {

            await updateProfile(data);

            Alert.alert(
                t("common.success"),
                t("settings.profile.updated")
            );

        } catch {
            Alert.alert(
                t("common.error"),
                t("settings.profile.updateFailed")
            );
        }
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">

            <AppHeader text={t("settings.profile.title")} onpress={() => navigation.goBack()} />

            {profileLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#036BB4" />
                </View>
            ) : (
            <View className="p-4">
                <ProfileImagePicker
                    image={avatar}
                    onChange={(file) => setValue("avatar", file)}
                />
                <FormInput
                    control={control}
                    name="name"
                    label={t("settings.profile.nameLabel")}
                    placeholder={t("settings.profile.namePlaceholder")}
                    rules={{ required: t("validation.nameRequired") }}
                />

                <FormInput
                    control={control}
                    name="email"
                    label={t("settings.profile.emailLabel")}
                    placeholder={t("settings.profile.emailPlaceholder")}
                    rules={{
                        required: t("validation.emailRequired"),
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: t("validation.emailInvalid"),
                        },
                    }}
                />

                <FormInput
                    control={control}
                    name="phone"
                    label={t("settings.profile.phoneLabel")}
                    placeholder={t("settings.profile.phonePlaceholder")}
                    rules={{ required: t("validation.phoneRequired") }}
                />


                <SubmitButton
                    text={t("settings.profile.save")}
                    loading={loading}
                    onSubmit={handleSubmit(onSubmit)}
                />

            </View>
            )}

        </SafeAreaView>
    );
}