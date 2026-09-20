import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function InvoiceRowSkeleton() {
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
      <View style={s.col1}>
        <View style={s.line} />
      </View>
      <View style={s.col2}>
        <View style={s.pill} />
      </View>
      <View style={s.col3}>
        <View style={s.circle} />
        <View style={s.circle} />
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#ffffff",
    minHeight: 64,
  },
  col1: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
  },
  col2: {
    width: 112,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  col3: {
    width: 112,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  line: {
    height: 16,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    width: "80%",
  },
  pill: {
    height: 24,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    width: 60,
  },
  circle: {
    height: 32,
    width: 32,
    backgroundColor: "#E2E8F0",
    borderRadius: 16,
  }
});
