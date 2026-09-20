import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

export function ShipmentRowSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[s.row, { opacity }]}>
      {/* Title Cell */}
      <View style={[s.cell, s.titleCell]}>
        <View style={s.titleSkeleton} />
      </View>

      {/* Status Cell */}
      <View style={[s.cell, s.statusCell]}>
        <View style={s.statusSkeleton} />
      </View>

      {/* Action Cell */}
      <View style={[s.cell, s.actionCell]}>
        <View style={s.iconSkeleton} />
        <View style={s.iconSkeleton} />
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#F1F5F9",
  },
  cell: { justifyContent: "center" },
  titleCell: { flex: 1.3 },
  statusCell: { flex: 1.2, alignItems: "center" },
  actionCell: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 14 },
  
  titleSkeleton: {
    height: 16,
    width: "80%",
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
  },
  statusSkeleton: {
    height: 24,
    width: 80,
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
  },
  iconSkeleton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E2E8F0",
  },
});
