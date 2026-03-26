// screens/driver/EditDriverScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Driver } from "../types";
import DriverForm from "../components/DriverForm";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DriverStackParamList } from "../../../navigation/types";



type Nav = NativeStackNavigationProp<DriverStackParamList, 'UpdateDriverProfile'>;
type RoutePropType = RouteProp<DriverStackParamList, "UpdateDriverProfile">;


export default function UpdateDriverScreen() {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<Nav>();

  const { driverId: id } = route.params;

  const [form, setForm] = useState<Driver>({
    id: "",
    name: "",
    phone: "",
    email: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Fetch driver details (replace with API later)
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setLoading(true);

        // TODO: Replace with API call
        const mockDriver: Driver = {
          id,
          name: "John Keita",
          phone: "+223 78 22 14 99",
          email: "demo@gmail.com",
          location: "Los Angeles",
        };

        setForm(mockDriver);
      } catch (err) {
        console.error("Failed to load driver", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // TODO: API update call
      console.log("Updated Driver:", form);

      navigation.goBack();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">

      <Text className="text-xl font-bold mb-4">
        Edit Vehicle Details
      </Text>

      <DriverForm form={form} setForm={setForm} />

      <TouchableOpacity
        onPress={handleUpdate}
        className="bg-black p-4 rounded-xl mt-4"
      >
        <Text className="text-white text-center">
          Save & Change
        </Text>
      </TouchableOpacity>

    </View>
  );
}