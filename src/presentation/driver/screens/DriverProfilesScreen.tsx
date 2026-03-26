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
        user?.id as string,
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

  const handleRemoveDriver = (id: string) => {
    // UI-only removal (optimistic)
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex-1 px-4">

        {/* HEADER */}
        <Text className="text-xl font-bold mb-4">
          Driver Profile Management
        </Text>

        {/* SEARCH */}
        <TextInput
          placeholder="Search driver..."
          value={search}
          onChangeText={setSearch}
          className="border p-3 rounded-lg mb-4"
        />

        {/* DRIVER LIST */}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={drivers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DriverCard
                driver={item}
                onOpen={() =>
                  navigation.navigate("DriverProfileDetails", {
                    driverId: item.id,
                  })
                }
                onRemove={() => handleRemoveDriver(item.id)}
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
        onPress={() => navigation.navigate("AddDriver")}
        className="absolute bottom-6 right-6 bg-black px-5 py-4 rounded-full shadow-lg"
      >
        <Text className="text-white font-semibold">+ Add</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}