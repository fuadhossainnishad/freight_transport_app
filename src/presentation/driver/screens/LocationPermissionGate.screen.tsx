// components/LocationPermissionGate.tsx
import { memo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Linking,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    status: "denied" | "blocked";
    onRequest: () => Promise<void>;
};

const LocationPermissionGateScreen = memo(function LocationPermissionGate({
    status,
    onRequest,
}: Props) {
    // blocked = user said "never ask again" → send to settings
    const isBlocked = status === "blocked";

    const handlePress = () => {
        if (isBlocked) {
            // open app settings so user can manually enable
            Linking.openSettings();
        } else {
            onRequest();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-8">

                {/* icon */}
                <View className="w-20 h-20 rounded-full bg-orange-50 items-center justify-center mb-6">
                    <Text style={{ fontSize: 36 }}>📍</Text>
                </View>

                {/* title */}
                <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
                    Location Access Required
                </Text>

                {/* description */}
                <Text className="text-sm text-gray-500 text-center leading-6 mb-8">
                    {isBlocked
                        ? "Location access was denied. Please enable it in your device settings to continue."
                        : "We need your precise location to assign shipments and track deliveries in real time."}
                </Text>

                {/* primary action */}
                <TouchableOpacity
                    onPress={handlePress}
                    className="w-full bg-orange-500 py-4 rounded-xl items-center mb-3"
                    activeOpacity={0.85}
                >
                    <Text className="text-white font-semibold text-base">
                        {isBlocked ? "Open Settings" : "Allow Location Access"}
                    </Text>
                </TouchableOpacity>

                {/* hint text */}
                <Text className="text-xs text-gray-400 text-center">
                    {isBlocked
                        ? `Go to Settings → ${Platform.OS === "ios" ? "Privacy → Location Services" : "App Permissions → Location"}`
                        : "Your location is only used while the app is active"}
                </Text>

            </View>
        </SafeAreaView>
    );
});

export default LocationPermissionGateScreen;