// screens/driver/DriverProfilesScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DriverStackParamList } from "../../../navigation/types";
import { useAuth } from "../../../app/context/Auth.context";

import DriverCard from "../components/DriverCard";
import { Driver } from "../types";
import { getTransporterDriversUseCase } from "../../../domain/usecases/driver.usecase";

import AddIcon from "../../../../assets/icons/add.svg"
import AppHeader from "../../../shared/components/AppHeader";
import { deleteDriver } from "../../../data/services/driverService";

type Nav = NativeStackNavigationProp<
  DriverStackParamList,
  "DriverProfile"
>;

export default function DriverProfilesScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ Load drivers via USECASE
  const loadDrivers = async () => {
    try {
      setLoading(true);

      const result = await getTransporterDriversUseCase(
        user?.transporter_id as string,
        search
      );

      setDrivers(result);
    } catch (err) {
      console.error("Failed to load drivers", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    if (user?.id) loadDrivers();
  }, [user?.id!]);

  // ✅ Search (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (user?.id) loadDrivers();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  const handleRemoveDriver = async (driverId: string) => {
    await deleteDriver(driverId)
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">

        {/* HEADER */}
        <AppHeader text="Driver Profile Management" onpress={() => navigation.goBack()} />

        <Text
          className="font-normal text-lg mx-4"
        >Active Shipments</Text>

        {/* SEARCH */}
        {/* <TextInput
          placeholder="Search driver..."
          value={search}
          onChangeText={setSearch}
          className="border p-3 rounded-lg mb-4"
        /> */}

        {/* DRIVER LIST */}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={drivers}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 16,
              gap: 16
            }}
            contentContainerStyle={{
              margin: 16
            }}
            renderItem={({ item }) => (
              <DriverCard
                driver={item}
                onView={() =>
                  navigation.navigate("DriverProfileDetails", {
                    driverId: item.id,
                  })
                }
                onDelete={() => handleRemoveDriver(item.id)}
                onEdit={() =>
                  navigation.navigate("UpdateDriverProfile", {
                    driverId: item.id,
                  })
                }
              />
            )}
            ListEmptyComponent={
              <Text className="text-gray-400 text-center mt-4">
                No drivers found
              </Text>
            }
          />
        )}
      </View>


      <TouchableOpacity
        className="p-3 rounded-xl m-4 flex-row gap-3 items-center justify-center border border-[#036BB4]"
        onPress={() => navigation.navigate("AddDriver")}
      >
        <AddIcon height={24} width={24} />
        <Text className="text-[#036BB4] text-center font-semibold">
          Add Driver
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}