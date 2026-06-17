import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

interface Props {
  step: number;      // 1-based current step
  total: number;     // total number of steps
}

const BLUE = "#036BB4";

/** Compact onboarding header: "Step X of N" + animated progress bar. */
export default function WizardHeader({ step, total }: Props) {
  const pct = Math.max(0, Math.min(1, step / total));
  const anim = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Text style={styles.stepText}>
          Step {step} of {total}
        </Text>
        <Text style={styles.pctText}>{Math.round(pct * 100)}%</Text>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  pctText: { fontSize: 13, fontWeight: "600", color: BLUE },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: BLUE,
  },
});
