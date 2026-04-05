import { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Shipment } from "../../../domain/entities/shipment.entity";

const GAP = 12;
const CARD_WIDTH_RATIO = 2; // (width - 80) / 2 — passed as prop for flexibility

type Props = {
  item: Shipment;
  isActive: boolean;
  cardWidth: number;
  cardHeightActive: number;
  cardHeightInactive: number;
  onPress: () => void;
};

export const ShipmentCarouselItem = memo(function ShipmentCarouselItem({
  item,
  isActive,
  cardWidth,
  cardHeightActive,
  cardHeightInactive,
  onPress,
}: Props) {
  const imageUri = item.images?.[0] ?? null;
  const height   = isActive ? cardHeightActive : cardHeightInactive;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={{
          width: cardWidth,
          height: cardHeightActive,
          justifyContent: "flex-end",
        }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: cardWidth,
              height,
              borderRadius: 12,
              opacity: isActive ? 1 : 0.55,
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: cardWidth,
              height,
              borderRadius: 12,
              opacity: isActive ? 1 : 0.55,
              backgroundColor: "#e5e7eb",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 11, color: "#9ca3af" }}>No image</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});