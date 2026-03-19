import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Bid from "../../../assets/icons/bid.svg";

type Props = {
  bid: any;
  onPress: () => void
};


export default function BidCard({ bid, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 m-1 bg-white rounded-2xl overflow-hidden border border-gray-200 mb-4">

      {/* Image Section */}
      <View className="relative">
        <Image
          source={{ uri: "https://onepullwire.com/wp-content/uploads/2020/10/0001.jpg" }}
          className="w-full h-40"
          resizeMode="cover"
          onError={() => console.log("Image failed:", bid.shipment_images?.[0])}

        />

        {/* Category Badge */}
        <View className="absolute bottom-2  px-3 py-1">
          <Text className="text-white text-base font-semibold">
            {bid.discription}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="px-3  py-4">

        {/* Route */}
        <View className="flex-row items-start mb-2">
          <Bid width={18} height={18} />
          <Text className="ml-2 items-center text-[#33363F] text-sm flex-1">
            {bid.pickup_address} → {bid.delivery_address}
          </Text>
        </View>

        {/* Price */}
        <Text className="text-lg font-bold text-[#0B0B0B]">
          ${bid.price}
        </Text>

      </View>
    </TouchableOpacity>
  );
}