import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { UserCircle, FileText, Edit2, Trash2 } from "lucide-react-native";
import { DriverStackParamList } from "../../../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";

import PreviewModal from "../components/PreviewModal";
import { getDriverByIdsUseCase } from "../../../domain/usecases/driver.usecase";
import { Driver } from "../types";
import { deleteDriver } from "../../../data/services/driverService";

type Nav = NativeStackNavigationProp<
  DriverStackParamList,
  "DriverProfileDetails"
>;

type RouteType = RouteProp<DriverStackParamList, "DriverProfileDetails">;

export default function DriverProfileDetailsScreen() {
  const { t } = useTranslation();
  const route = useRoute<RouteType>();
  const navigation = useNavigation<Nav>();

  const { driverId } = route.params;

  const [showLicense, setShowLicense] = useState(false);
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<Driver>();
  const [deleting, setDeleting] = useState(false);

  const licenseImage = driver?.licenseBack || driver?.licenseFront;

  useEffect(() => {
    fetchDriver();
  }, []);

  const fetchDriver = async () => {
    try {
      setLoading(true);
      const res = await getDriverByIdsUseCase(driverId);
      setDriver(res);
    } catch (err) {
      Alert.alert(t("common.error"), t("driver.update.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate("UpdateDriverProfile", { driverId });
  };

  const handleDelete = () => {
    Alert.alert(t("driver.details.confirmTitle"), t("driver.details.confirmMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("driver.details.remove"),
        style: "destructive",
        onPress: confirmDelete,
      },
    ]);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteDriver(driverId);

      Alert.alert(t("common.success"), t("driver.details.removed"));
      navigation.goBack();
    } catch (err) {
      Alert.alert(t("common.error"), t("driver.details.removeFailed"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader
        text={t("driver.details.title")}
        onpress={() => navigation.goBack()}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#036BB4" />
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* AVATAR */}
            <View className="items-center mt-8 mb-8">
              {driver?.avatar ? (
                <View className="shadow-sm shadow-black/5 rounded-full bg-white p-1 border border-gray-100">
                  <Image
                    source={{ uri: driver.avatar }}
                    className="w-28 h-28 rounded-full bg-gray-100"
                  />
                </View>
              ) : (
                <View className="shadow-sm shadow-black/5 rounded-full bg-white p-1 border border-gray-100">
                  <View className="w-28 h-28 rounded-full bg-[#036BB4]/5 items-center justify-center">
                    <UserCircle size={56} color="#036BB4" strokeWidth={1.2} />
                  </View>
                </View>
              )}
              <Text className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">
                {driver?.name || t("driver.details.fallbackName")}
              </Text>
              <Text className="mt-1 text-gray-500 font-medium text-base">
                {driver?.phone || "—"}
              </Text>
            </View>

            {/* INFO BLOCK */}
            <View className="px-5">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">
                {t("driver.details.contactInfo", "Information")}
              </Text>
              <View className="bg-white rounded-3xl border border-gray-100 shadow-sm shadow-black/5 overflow-hidden">
                
                <View className="px-5 py-4 border-b border-gray-50 flex-row justify-between items-center">
                  <Text className="text-gray-500 font-medium">{t("driver.details.nameLabel")}</Text>
                  <Text className="text-gray-900 font-semibold">{driver?.name || "—"}</Text>
                </View>

                <View className="px-5 py-4 border-b border-gray-50 flex-row justify-between items-center">
                  <Text className="text-gray-500 font-medium">{t("driver.details.phoneLabel")}</Text>
                  <Text className="text-gray-900 font-semibold">{driver?.phone || "—"}</Text>
                </View>

                <View className="px-5 py-4 border-b border-gray-50 flex-row justify-between items-center">
                  <Text className="text-gray-500 font-medium">{t("driver.details.emailLabel")}</Text>
                  <Text className="text-gray-900 font-semibold">{driver?.email || "—"}</Text>
                </View>

                <View className="px-5 py-4 flex-row justify-between items-center">
                  <Text className="text-gray-500 font-medium">{t("driver.details.drivingLicense")}</Text>
                  
                  <TouchableOpacity
                    activeOpacity={licenseImage ? 0.7 : 1}
                    disabled={!licenseImage}
                    onPress={() => licenseImage && setShowLicense(true)}
                    className="flex-row items-center gap-1.5"
                  >
                    {licenseImage ? (
                      <>
                        <FileText size={16} color="#036BB4" strokeWidth={2.5} />
                        <Text className="text-[#036BB4] font-bold">
                          {t("driver.details.viewDocument")}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-gray-900 font-semibold">—</Text>
                    )}
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </ScrollView>

          {/* ACTIONS */}
          <View className="flex-row gap-3 px-5 pb-6 pt-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="flex-1 bg-[#036BB4] py-4 rounded-2xl flex-row justify-center items-center gap-2 shadow-sm shadow-[#036BB4]/30"
            >
              <Edit2 size={18} color="#FFF" />
              <Text className="font-bold text-white text-base">{t("common.edit")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-50 border border-red-100 py-4 rounded-2xl flex-row justify-center items-center gap-2"
            >
              {deleting ? (
                <ActivityIndicator color="#ef4444" />
              ) : (
                <>
                  <Trash2 size={18} color="#ef4444" />
                  <Text className="font-bold text-[#ef4444] text-base">{t("driver.details.remove")}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* LICENSE MODAL */}
      {licenseImage && (
        <PreviewModal
          imageUrl={licenseImage}
          show={showLicense}
          setShow={setShowLicense}
        />
      )}
    </SafeAreaView>
  );
}
