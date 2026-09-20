import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import AppHeader from "./AppHeader";

const { width } = Dimensions.get("window");

export default function ShipmentDetailSkeleton({ onBack }: { onBack: () => void }) {
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
    <SafeAreaView style={s.safeArea}>
      <AppHeader text="Loading..." onpress={onBack} />
      
      <Animated.View style={[s.container, { opacity }]}>
        {/* Status Badge Skeleton */}
        <View style={s.badge} />
        
        {/* Hero Image Skeleton */}
        <View style={s.hero} />
        
        {/* Card 1 Skeleton */}
        <View style={s.card}>
          <View style={s.cardHeader} />
          <View style={s.row}>
            <View style={s.field} />
            <View style={s.field} />
          </View>
          <View style={s.row}>
            <View style={s.field} />
            <View style={s.field} />
          </View>
        </View>

        {/* Card 2 Skeleton */}
        <View style={s.card}>
          <View style={s.cardHeader} />
          <View style={s.row}>
            <View style={s.field} />
            <View style={s.field} />
          </View>
          <View style={s.fieldFull} />
        </View>
        
      </Animated.View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    gap: 16,
  },
  badge: {
    width: 100,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
    marginBottom: 4,
  },
  hero: {
    width: "100%",
    height: width * 0.5,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    width: 120,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  field: {
    flex: 1,
    height: 36,
    borderRadius: 4,
    backgroundColor: "#F1F5F9",
  },
  fieldFull: {
    width: "100%",
    height: 36,
    borderRadius: 4,
    backgroundColor: "#F1F5F9",
  }
});
