import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MapPin, Package, ArrowRight } from "lucide-react-native";
import { normalizeImageUrl } from "../utils/normalizeImageUrl";

type Props = {
  bid: any;
  width: number;
  onPress: () => void;
};

export default function BidCard({ bid, width, onPress }: Props) {
  const [imgError, setImgError] = useState(false);

  const rawImage = bid?.shipment_images?.[0];
  const uri = rawImage ? normalizeImageUrl(rawImage) : "";
  const showImage = !!uri && !imgError;

  const title = bid?.shipment_title || bid?.category || "Shipment";
  const pickup = bid?.pickup_address || "—";
  const delivery = bid?.delivery_address || "—";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width,
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#EEF1F4",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      {/* Image */}
      <View style={{ width: "100%", height: 112, backgroundColor: "#EEF2F6" }}>
        {showImage ? (
          <Image
            source={{ uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Package size={30} color="#9AA8B5" />
          </View>
        )}

        {/* Price pill */}
        {bid?.price != null && (
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "#036BB4",
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>
              ${Number(bid.price).toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{ padding: 12 }}>
        {/* Title — truncated */}
        <Text numberOfLines={1} style={{ fontSize: 14.5, fontWeight: "700", color: "#0F172A" }}>
          {title}
        </Text>

        {/* Location — truncated */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7 }}>
          <MapPin size={13} color="#94A3B8" />
          <Text
            numberOfLines={1}
            style={{ flex: 1, marginLeft: 5, fontSize: 12, color: "#64748B" }}
          >
            {pickup}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
          <ArrowRight size={13} color="#94A3B8" />
          <Text
            numberOfLines={1}
            style={{ flex: 1, marginLeft: 5, fontSize: 12, color: "#64748B" }}
          >
            {delivery}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
