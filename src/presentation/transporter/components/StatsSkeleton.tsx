// components/stats/StatsSkeleton.tsx
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

function SkeletonCard({ fullWidth }: { fullWidth?: boolean }) {
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
    <Animated.View
      style={{ opacity }}
      className={`${fullWidth ? "w-full" : "flex-1"} h-20 bg-gray-200 rounded-xl`}
    />
  );
}

export function StatsSkeleton() {
  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <SkeletonCard />
        <SkeletonCard />
      </View>
      <SkeletonCard fullWidth />
    </View>
  );
}