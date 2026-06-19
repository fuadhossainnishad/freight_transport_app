import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Image,
    FlatList,
    Dimensions,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { Truck } from "lucide-react-native";

interface Props {
    images: string[];
    /** Horizontal padding the carousel sits inside (defaults to 16 = px-4). */
    horizontalPadding?: number;
    height?: number;
    /** Auto-advance the slides. */
    autoPlay?: boolean;
    /** Time each slide stays visible, in ms. */
    autoPlayInterval?: number;
}

const VehicleImageCarousel: React.FC<Props> = ({
    images,
    horizontalPadding = 16,
    height = 240,
    autoPlay = true,
    autoPlayInterval = 3500,
}) => {
    const itemWidth = Dimensions.get("window").width - horizontalPadding * 2;
    const [index, setIndex] = useState(0);
    const listRef = useRef<FlatList>(null);
    const interacting = useRef(false);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const next = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
        if (next !== index) setIndex(next);
    };

    // Auto-advance, looping back to the first image. Pauses while the user is
    // actively dragging and resumes afterwards. Re-arms whenever the active
    // index changes, so a manual swipe also resets the timer.
    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;

        const timer = setTimeout(() => {
            if (interacting.current) return;
            const next = (index + 1) % images.length;
            listRef.current?.scrollToOffset({ offset: next * itemWidth, animated: true });
            setIndex(next);
        }, autoPlayInterval);

        return () => clearTimeout(timer);
    }, [index, images.length, itemWidth, autoPlay, autoPlayInterval]);

    // Empty / no-image state
    if (!images?.length) {
        return (
            <View
                style={{ width: itemWidth, height, borderRadius: 16 }}
                className="bg-gray-100 items-center justify-center"
            >
                <Truck size={44} color="#9CA3AF" strokeWidth={1.5} />
            </View>
        );
    }

    return (
        <View style={{ width: itemWidth, height, borderRadius: 16, overflow: "hidden" }}>
            <FlatList
                ref={listRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                onScrollBeginDrag={() => (interacting.current = true)}
                onScrollEndDrag={() => (interacting.current = false)}
                scrollEventThrottle={16}
                keyExtractor={(_, i) => `vehicle-image-${i}`}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={{ width: itemWidth, height }}
                        resizeMode="cover"
                    />
                )}
            />

            {/* Liquid-glass pagination pill */}
            {images.length > 1 && (
                <View style={styles.pillWrap} pointerEvents="none">
                    <View style={styles.pill}>
                        <BlurView
                            style={StyleSheet.absoluteFill}
                            blurType="light"
                            blurAmount={12}
                            reducedTransparencyFallbackColor="rgba(255,255,255,0.4)"
                        />
                        {/* Glass tint + sheen */}
                        <View style={styles.glassTint} />
                        <View style={styles.dotsRow}>
                            {images.map((_, i) => (
                                <View
                                    key={i}
                                    style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    pillWrap: {
        position: "absolute",
        bottom: 12,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    pill: {
        borderRadius: 999,
        overflow: "hidden",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(255,255,255,0.55)",
    },
    glassTint: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255,255,255,0.18)",
    },
    dotsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    dotActive: {
        width: 18,
        backgroundColor: "#FFFFFF",
    },
    dotInactive: {
        width: 6,
        backgroundColor: "rgba(255,255,255,0.6)",
    },
});

export default VehicleImageCarousel;
