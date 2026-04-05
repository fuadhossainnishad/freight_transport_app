import { useCallback, useRef, useMemo, useState, useEffect } from "react";
import { Dimensions, FlatList, ViewToken } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Shipment } from "../../../domain/entities/shipment.entity";
import { TransporterHomeStackParamList } from "../../../navigation/types";
import { ShipmentCarouselItem } from "./ShipmentCarouselItem";

// ─────────────────────────────
// CONSTANTS
// ─────────────────────────────
const { width } = Dimensions.get("window");
const GAP = 12;
const CLONE_COUNT = 2;
const CARD_WIDTH = (width - 80) / 2;
const CARD_HEIGHT_ACTIVE = CARD_WIDTH;
const CARD_HEIGHT_INACTIVE = CARD_WIDTH - 24;
const SNAP_INTERVAL = CARD_WIDTH + GAP;

type NavigationProp = NativeStackNavigationProp<
  TransporterHomeStackParamList,
  "Home"
>;

type Props = {
  shipments: Shipment[];
  onShipmentFocus: (shipment: Shipment) => void; // ← tells parent which shipment is focused
  onActiveIndexChange: (index: number) => void;
};

export function ShipmentsCarousel({
  shipments,
  onShipmentFocus,
  onActiveIndexChange,
}: Props) {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const isJumping = useRef(false);
  const lastFiredIndex = useRef(-1);
  const shipmentsRef = useRef<Shipment[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // keep ref in sync
  useEffect(() => {
    shipmentsRef.current = shipments;
  }, [shipments]);

  // ─────────────────────────────
  // INFINITE LIST
  // ─────────────────────────────
  const infiniteShipments = useMemo(() => {
    if (shipments.length === 0) return [];
    return [
      ...shipments.slice(-CLONE_COUNT),
      ...shipments,
      ...shipments.slice(0, CLONE_COUNT),
    ];
  }, [shipments]);

  // ─────────────────────────────
  // VIEWABILITY
  // ─────────────────────────────
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 90,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems?.length || isJumping.current) return;

      const rawIndex = viewableItems[0]?.index ?? 0;
      if (rawIndex === lastFiredIndex.current) return;
      lastFiredIndex.current = rawIndex;

      const list = shipmentsRef.current;
      const totalReal = list.length;
      if (totalReal === 0) return;

      const realIndex = ((rawIndex - CLONE_COUNT) % totalReal + totalReal) % totalReal;

      setActiveIndex(realIndex);
      onActiveIndexChange(realIndex);     // ← notify parent of index change
      onShipmentFocus(list[realIndex]);   // ← notify parent which shipment is focused

      if (rawIndex < CLONE_COUNT) {
        isJumping.current = true;
        flatListRef.current?.scrollToIndex({ index: rawIndex + totalReal, animated: false });
      } else if (rawIndex >= CLONE_COUNT + totalReal) {
        isJumping.current = true;
        flatListRef.current?.scrollToIndex({ index: rawIndex - totalReal, animated: false });
      }
    },
    [onShipmentFocus, onActiveIndexChange]
  );

  return (
    <FlatList
      ref={flatListRef}
      data={infiniteShipments}
      extraData={activeIndex}
      horizontal
      pagingEnabled={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      snapToInterval={SNAP_INTERVAL}
      decelerationRate="fast"
      initialScrollIndex={CLONE_COUNT}
      getItemLayout={(_, index) => ({
        length: SNAP_INTERVAL,
        offset: SNAP_INTERVAL * index,
        index,
      })}
      contentContainerStyle={{ gap: GAP, paddingVertical: 8 }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onMomentumScrollEnd={() => { isJumping.current = false; }}
      onScrollEndDrag={() => { isJumping.current = false; }}
      renderItem={({ item, index }) => {
        const totalReal = shipments.length;
        const realIndex = ((index - CLONE_COUNT) % totalReal + totalReal) % totalReal;
        const isActive = activeIndex === realIndex;

        return (
          <ShipmentCarouselItem
            item={item}
            isActive={isActive}
            cardWidth={CARD_WIDTH}
            cardHeightActive={CARD_HEIGHT_ACTIVE}
            cardHeightInactive={CARD_HEIGHT_INACTIVE}
            onPress={() =>
              navigation.navigate("ShipmentDetails", { shipmentId: item.id })
            }
          />
        );
      }}
    />
  );
}