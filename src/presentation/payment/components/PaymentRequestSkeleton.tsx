import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function PaymentRequestSkeleton() {
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
    <Animated.View style={[s.card, { opacity }]}>
      <View style={s.cardTop}>
        <View style={s.shortId} />
        <View style={s.badge} />
      </View>

      <View style={s.title} />

      <View style={s.routeRow}>
        <View style={s.route} />
      </View>

      <View style={s.cardBottom}>
        <View style={s.amount} />
        <View style={s.payBtn} />
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  shortId: { height: 16, width: 80, backgroundColor: "#E2E8F0", borderRadius: 4 },
  badge: { height: 22, width: 70, backgroundColor: "#E2E8F0", borderRadius: 11 },

  title: { height: 20, width: "60%", backgroundColor: "#E2E8F0", borderRadius: 4, marginTop: 8 },
  
  routeRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  route: { height: 14, width: "85%", backgroundColor: "#E2E8F0", borderRadius: 4 },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  amount: { height: 22, width: 100, backgroundColor: "#E2E8F0", borderRadius: 4 },
  payBtn: { height: 36, width: 100, backgroundColor: "#E2E8F0", borderRadius: 18 },
});
