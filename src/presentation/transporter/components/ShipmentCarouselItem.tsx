import { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Shipment } from "../../../domain/entities/shipment.entity";
import { useShipmentOptions } from "../../../shared/i18n/useShipmentOptions";

const truckPlaceholder = require("../../../../assets/images/truck.png");

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
  const { t } = useTranslation();
  const { categoryLabel } = useShipmentOptions();
  const imageUri = item.images?.[0] ?? null;
  const imageHeight = isActive ? cardHeightActive : cardHeightInactive;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={{
          width: cardWidth,
          backgroundColor: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          opacity: isActive ? 1 : 0.6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Orange active dot */}
        {isActive && (
          <View
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#f97316",
              zIndex: 1,
            }}
          />
        )}

        {/* Image */}
        <View
          style={{
            width: cardWidth,
            height: imageHeight,
            backgroundColor: "#ffffff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={imageUri ? { uri: imageUri } : truckPlaceholder}
            style={{
              width: cardWidth - 16,
              height: imageHeight - 16,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Title + category */}
        <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
          <Text
            numberOfLines={1}
            style={{ fontSize: 13, fontWeight: "700", color: "#111827" }}
          >
            {item.title ?? t("transporter.home.shipmentFallbackTitle")}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}
          >
            {categoryLabel(item.category)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
