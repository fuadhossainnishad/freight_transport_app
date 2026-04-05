// components/stats/StatsError.tsx
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
    message: string | null;
    onRetry: () => void;
};

export function StatsError({ message, onRetry }: Props) {
    return (
        <View className="bg-red-50 rounded-xl p-4 items-center gap-2">
            <Text className="text-sm text-red-500 text-center">
                {message ?? "Failed to load stats"}
            </Text>
            <TouchableOpacity
                onPress={onRetry}
                className="bg-red-100 px-4 py-2 rounded-lg mt-1"
            >
                <Text className="text-sm font-semibold text-red-600">Try again</Text>
            </TouchableOpacity>
        </View>
    );
}