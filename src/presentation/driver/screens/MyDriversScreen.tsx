import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Alert,
    RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Users, Plus } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../../app/context/Auth.context";
import { MyDriversStackParamList } from "../../../navigation/types";
import AppHeader from "../../../shared/components/AppHeader";
import DriverCard from "../components/DriverCard";
import { Driver } from "../types";
import { getTransporterDriversUseCase } from "../../../domain/usecases/driver.usecase";
import { deleteDriver } from "../../../data/services/driverService";

type props = NativeStackNavigationProp<MyDriversStackParamList, "MyDrivers">;

const PRIMARY = "#036BB4";

const MyDriversScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<props>();
    const { user } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDrivers = useCallback(async () => {
        try {
            const data = await getTransporterDriversUseCase(user?.transporter_id!);
            setDrivers(data);
        } catch (err) {
            console.log(err);
            Alert.alert(t("common.error"), t("driver.list.loadFailed"));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.transporter_id, t]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchDrivers);
        return unsubscribe;
    }, [navigation, fetchDrivers]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchDrivers();
    }, [fetchDrivers]);

    const handleDelete = (id: string) => {
        Alert.alert(t("driver.list.deleteTitle"), t("driver.list.deleteMessage"), [
            { text: t("common.cancel"), style: "cancel" },
            {
                text: t("common.delete"),
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteDriver(id);
                        setDrivers((prev) => prev.filter((d) => d.id !== id));
                    } catch (err) {
                        Alert.alert(t("common.error"), t("driver.list.deleteFailed"));
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
            <AppHeader text={t("driver.list.title")} onpress={() => navigation.goBack()} />

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={PRIMARY} />
                </View>
            ) : (
                <FlatList
                    data={drivers}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        paddingTop: 8,
                        paddingBottom: 24,
                        paddingHorizontal: 16,
                        gap: 12,
                        flexGrow: 1,
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />
                    }
                    renderItem={({ item }) => (
                        <DriverCard
                            driver={item}
                            onView={() =>
                                navigation.navigate("DriverProfileDetails", { driverId: item.id })
                            }
                            onEdit={() =>
                                navigation.navigate("UpdateDriverProfile", { driverId: item.id })
                            }
                            onDelete={() => handleDelete(item.id)}
                        />
                    )}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center px-8 py-20">
                            <View className="w-20 h-20 rounded-full bg-[#036BB4]/10 items-center justify-center mb-4">
                                <Users size={36} color={PRIMARY} strokeWidth={1.5} />
                            </View>
                            <Text className="text-base font-semibold text-gray-900">{t("driver.list.emptyTitle")}</Text>
                            <Text className="text-sm text-gray-500 text-center mt-1.5 leading-5">
                                {t("driver.list.emptySubtitle")}
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Add driver CTA */}
            <View className="px-4 pt-2 pb-4 bg-gray-50">
                <TouchableOpacity
                    className="py-4 rounded-full flex-row gap-2 items-center justify-center"
                    style={{ backgroundColor: PRIMARY }}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("AddDriver")}
                >
                    <Plus size={20} color="#fff" strokeWidth={2.5} />
                    <Text className="text-white text-center font-semibold text-base">{t("driver.list.addDriver")}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default MyDriversScreen;
