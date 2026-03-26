// screens/driver/DriverProfileDetailsScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DriverStackParamList } from "../../../navigation/types";

type Props = NativeStackNavigationProp<DriverStackParamList, 'DriverProfileDetails'>;
type RoutePropType = RouteProp<DriverStackParamList, "UpdateDriverProfile">;

export default function DriverProfileDetailsScreen() {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<Props>();

  const { driverId: id } = route.params;

  // fetch driver using id

  return (
    <View className="flex-1 bg-white p-4">

      <Text className="text-xl font-bold mb-4">Driver Profile Details</Text>

      <Text className="mb-2">Driver Name: John Keita</Text>
      <Text className="mb-2">Number: +223 78 22 14 99</Text>
      <Text className="mb-2">Email: demo@gmail.com</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("UpdateDriverProfile", { driverId: id })}
        className="bg-black p-4 rounded-xl mt-4"
      >
        <Text className="text-white text-center">Edit Details</Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-3">
        <Text className="text-red-500 text-center">Remove</Text>
      </TouchableOpacity>

    </View>
  );
}