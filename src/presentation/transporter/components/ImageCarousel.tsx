import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 60;
const SPACING = 16;

const MockImages = [
  { id: "1", uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  { id: "2", uri: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" },
  { id: "3", uri: "https://images.unsplash.com/photo-1522205408450-add114ad53fe" },
  { id: "4", uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
];

export default function ImageCarouselFocus() {
  const [activeIndex, setActiveIndex] = useState(0);

  const lastIndexRef = useRef(0);

  // ─────────────────────────────
  // SCROLL HANDLER (marker logic)
  // ─────────────────────────────
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;

      // calculate index based on snap width
      const index = Math.round(offsetX / (ITEM_WIDTH + SPACING));

      if (index !== lastIndexRef.current) {
        lastIndexRef.current = index;
        setActiveIndex(index);

        const item = MockImages[index];

        if (item) {
          console.log("🎯 Marker Hit:", item.id);
        }
      }
    },
    []
  );

  // ─────────────────────────────
  // RENDER ITEM
  // ─────────────────────────────
  const renderItem = useCallback(
    ({ item, index }) => {
      const isActive = index === activeIndex;

      return (
        <View
          style={{ width: ITEM_WIDTH }}
          className={`mx-2 rounded-2xl overflow-hidden ${
            isActive ? "border-4 border-orange-500" : "border border-gray-300"
          }`}
        >
          <Image
            source={{ uri: item.uri }}
            className="w-full h-52"
            resizeMode="cover"
          />
        </View>
      );
    },
    [activeIndex]
  );

  return (
    <View className="flex-1 justify-center bg-gray-100">

      {/* 🎯 MARKER LINE (visual) */}
      <View
        style={{
          position: "absolute",
          left: width / 2 - 1,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: "red",
          zIndex: 10,
        }}
      />

      <FlatList
        data={MockImages}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: (width - ITEM_WIDTH) / 2,
        }}
        renderItem={renderItem}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Debug */}
      <View className="items-center mt-4">
        <Text>Active Index: {activeIndex}</Text>
      </View>
    </View>
  );
}