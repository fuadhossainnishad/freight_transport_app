import React from "react";
import {
    View,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import FormInput from "../../../shared/components/FormInput";
import AppHeader from "../../../shared/components/AppHeader";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { UserProfile } from "../../../domain/entities/user.entity";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../../../navigation/types";
import SubmitButton from "../../../shared/components/SubmitButton";
import ProfileImagePicker from "../../../shared/components/ProfileImagePicker";

type props = NativeStackNavigationProp<SettingsStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
    const navigation = useNavigation<props>()
    const { updateProfile, loading } = useUpdateProfile();

    const {
        control,
        handleSubmit,
        setValue,
        watch
    } = useForm<UserProfile>({
        defaultValues: {
            name: "Sunan Rahman",
            email: "demo@gmail.com",
            phone: "+99007007007",
            avatar: null
        },
    });
    const avatar = watch("avatar");

    const onSubmit = async (data: UserProfile) => {
        try {

            await updateProfile(data);

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
                <ProfileImagePicker
                    image={avatar}
                    onChange={(file) => setValue("avatar", file)}
                />
                <FormInput
                    control={control}
                    name="name"
                    label="User Name"
                    placeholder="Enter name"
                    rules={{ required: "Name is required" }}
                />

                <FormInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    rules={{
                        required: "Email is required",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Invalid email",
                        },
                    }}
                />

                <FormInput
                    control={control}
                    name="phone"
                    label="Contact No"
                    placeholder="Enter phone"
                    rules={{ required: "Phone number required" }}
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