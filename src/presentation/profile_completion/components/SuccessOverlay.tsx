import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";

interface Props {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onDone?: () => void;
}

const GREEN = "#22C55E";

/**
 * Full-screen success animation shown after profile completion:
 *  - the screen fades in
 *  - expanding pulse rings radiate outward
 *  - a green circle springs in with a check that pops
 *  - the title/subtitle slide up
 * Calls `onDone` once the celebration has had a beat to land.
 */
export default function SuccessOverlay({
  visible,
  title = "Profile completed!",
  subtitle = "You're all set — welcome aboard 🎉",
  onDone,
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const circle = useRef(new Animated.Value(0)).current;
  const check = useRef(new Animated.Value(0)).current;
  const text = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    const pulse = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, {
            toValue: 1,
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      );

    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.spring(circle, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.spring(check, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(text, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const loops = [pulse(ring1, 150), pulse(ring2, 750)];
    loops.forEach((l) => l.start());

    const t = setTimeout(() => {
      loops.forEach((l) => l.stop());
      onDone?.();
    }, 2100);

    return () => {
      clearTimeout(t);
      loops.forEach((l) => l.stop());
    };
  }, [visible]);

  if (!visible) return null;

  const ringStyle = (v: Animated.Value) => ({
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
    transform: [
      { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.4] }) },
    ],
  });

  return (
    <Animated.View style={[styles.overlay, { opacity: fade }]}>
      <View style={styles.center}>
        {/* expanding pulse rings */}
        <Animated.View style={[styles.ring, ringStyle(ring1)]} />
        <Animated.View style={[styles.ring, ringStyle(ring2)]} />

        {/* green circle + check */}
        <Animated.View style={[styles.circle, { transform: [{ scale: circle }] }]}>
          <Animated.View style={{ transform: [{ scale: check }] }}>
            <Check size={56} color="#fff" strokeWidth={4} />
          </Animated.View>
        </Animated.View>
      </View>

      <Animated.View
        style={{
          opacity: text,
          transform: [
            { translateY: text.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
          ],
          alignItems: "center",
          marginTop: 36,
          paddingHorizontal: 32,
        }}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const RING = 132;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  center: {
    width: RING,
    height: RING,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    backgroundColor: GREEN,
  },
  circle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
  },
});
