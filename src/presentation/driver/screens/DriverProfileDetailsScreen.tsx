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
import { UserCircle, FileText } from "lucide-react-native";
import { DriverStackParamList } from "../../../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";

import PreviewModal from "../components/PreviewModal";
import { getDriverByIdsUseCase } from "../../../domain/usecases/driver.usecase";
import { Driver } from "../types";
import { deleteDriver } from "../../../data/services/driverService";

import EditIcon from "../../../../assets/icons/edit3.svg";
import DeleteIcon from "../../../../assets/icons/delete.svg";

type Nav = NativeStackNavigationProp<
  DriverStackParamList,
  "DriverProfileDetails"
>;

type RouteType = RouteProp<DriverStackParamList, "DriverProfileDetails">;

export default function DriverProfileDetailsScreen() {
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
      Alert.alert("Error", "Failed to load driver");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate("UpdateDriverProfile", { driverId });
  };

  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to remove this driver?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: confirmDelete,
      },
    ]);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteDriver(driverId);

      Alert.alert("Success", "Driver removed successfully");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to remove driver");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader
        text="Driver Profile Details"
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
            <View className="items-center mt-6 mb-6">
              {driver?.avatar ? (
                <Image
                  source={{ uri: driver.avatar }}
                  className="w-24 h-24 rounded-full bg-gray-100"
                />
              ) : (
                <UserCircle size={96} color="#C7C7CC" strokeWidth={1} />
              )}
              <Text className="mt-3 text-lg font-bold text-[#1A1C1E]">
                {driver?.name || "Driver"}
              </Text>
            </View>

            {/* INFO CARDS */}
            <View className="px-4 gap-3">
              <View className="p-4 rounded-2xl border border-gray-200 bg-white">
                <Text className="text-gray-400 text-sm mb-1">Driver Name</Text>
                <Text className="text-[#1A1C1E] text-base font-semibold">
                  {driver?.name || "—"}
                </Text>
              </View>

              <View className="p-4 rounded-2xl border border-gray-200 bg-white">
                <Text className="text-gray-400 text-sm mb-1">Phone Number</Text>
                <Text className="text-[#1A1C1E] text-base font-semibold">
                  {driver?.phone || "—"}
                </Text>
              </View>

              <View className="p-4 rounded-2xl border border-gray-200 bg-white">
                <Text className="text-gray-400 text-sm mb-1">Email</Text>
                <Text className="text-[#1A1C1E] text-base font-semibold">
                  {driver?.email || "—"}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={licenseImage ? 0.7 : 1}
                disabled={!licenseImage}
                onPress={() => licenseImage && setShowLicense(true)}
                className="p-4 rounded-2xl border border-gray-200 bg-white"
              >
                <Text className="text-gray-400 text-sm mb-2">
                  Driving License
                </Text>
                {licenseImage ? (
                  <View className="flex-row items-center gap-2">
                    <FileText size={20} color="#036BB4" strokeWidth={1.8} />
                    <Text className="text-[#036BB4] text-base font-semibold">
                      View document
                    </Text>
                  </View>
                ) : (
                  <Text className="text-[#1A1C1E] text-base font-semibold">
                    —
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* ACTIONS */}
          <View className="flex-row gap-3 px-4 pb-4 pt-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="flex-1 border border-[#036BB4] py-3 rounded-full flex-row justify-center items-center gap-2"
            >
              <EditIcon height={18} width={18} />
              <Text className="font-semibold text-[#036BB4]">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={deleting}
              className="flex-1 border border-[#FF3B30] py-3 rounded-full flex-row justify-center items-center gap-2"
            >
              {deleting ? (
                <ActivityIndicator color="#FF3B30" />
              ) : (
                <>
                  <DeleteIcon height={18} width={18} />
                  <Text className="font-semibold text-[#FF3B30]">Remove</Text>
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
