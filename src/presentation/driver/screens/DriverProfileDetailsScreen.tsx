import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DriverStackParamList } from "../../../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";

import FileIcon from "../../../../assets/icons/docs.svg"
import PreviewModal from "../components/PreviewModal";
import { getDriverByIdsUseCase } from "../../../domain/usecases/driver.usecase";
import { Driver } from "../types";
import { deleteDriver } from "../../../data/services/driverService";

import EditIcon from '../../../../assets/icons/edit3.svg'
import DeleteIcon from '../../../../assets/icons/delete.svg'


type Nav = NativeStackNavigationProp<
  DriverStackParamList,
  "DriverProfileDetails"
>;

type RouteType = RouteProp<
  DriverStackParamList,
  "DriverProfileDetails"
>;

export default function DriverProfileDetailsScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation<Nav>();

  const { driverId } = route.params;

  const [showLicense, setShowLicense] = useState(false);
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<Driver>()
  const [deleting, setDeleting] = useState(false);
  // dummy data (replace with API later)
  // const driver = {
  //   name: "John Keita",
  //   number: "+223 78 22 14 99",
  //   email: "demo@gmail.com",
  //   licenseImage:
  //     "https://images.unsplash.com/photo-1600267165477-6d4cc741b379?w=800",
  // };

  useEffect(() => {
    fetchDriver();
  }, []);
  const fetchDriver = async () => {
    try {
      setLoading(true);
      const res = await getDriverByIdsUseCase(driverId);
      setDriver(res);
    } catch (err) {
      Alert.alert("Error", "Failed to load vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate("UpdateDriverProfile", { driverId });
  };

  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this vehicle?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: confirmDelete,
      },
    ]);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteDriver(driverId)

      Alert.alert("Success", "Vehicle removed successfully");
      navigation.goBack(); // 🔥 important
    } catch (err) {
      Alert.alert("Error", "Failed to delete vehicle");
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

      {/* CARD */}
      <View className="mx-4 mt-4 border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">

        {/* Row 1 */}
        <View className="p-4">
          <Text className="text-gray-500 text-sm">Driver Name</Text>
          <Text className="text-black font-semibold">{driver?.name!}</Text>
        </View>

        <View className="h-[1px] bg-gray-200" />

        {/* Row 2 */}
        <View className="p-4">
          <Text className="text-gray-500 text-sm">Phone Number</Text>
          <Text className="text-black font-semibold">{driver?.phone!}</Text>
        </View>

        <View className="h-[1px] bg-gray-200" />

        {/* Row 3 */}
        <View className="p-4">
          <Text className="text-gray-500 text-sm">Email</Text>
          <Text className="text-black font-semibold">{driver?.email}</Text>
        </View>

        <View className="h-[1px] bg-gray-200" />

        {/* Row 4 - Driving License */}
        <TouchableOpacity
          onPress={() => setShowLicense(true)}
          className="p-4 gap-2"
        >
          <View>
            <Text className="text-gray-500 text-sm">Driving License</Text>
          </View>

          <FileIcon height={24} width={24} />
        </TouchableOpacity>
      </View>


      <View className="flex-row gap-3 mb-6 p-4">
        <TouchableOpacity
          onPress={handleEdit}
          className="flex-1 border border-[#036BB4] py-3 rounded-full flex-row justify-center items-center gap-2"
        >
          <EditIcon height={18} width={18} />
          <Text className="font-medium  text-[#036BB4]">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          disabled={deleting}
          className="flex-1 border border-[#FF0000] py-3 rounded-full flex-row justify-center items-center gap-2 text-[#FF0000]"
        >
          {deleting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <DeleteIcon height={18} width={18} />
              <Text className="font-semibold text-[#FF0000]">Remove</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* LICENSE MODAL */}
      <PreviewModal
        imageUrl={driver?.licenseBack!}
        show={showLicense}
        setShow={setShowLicense}
      />
    </SafeAreaView>
  );
}