// components/stats/StatsError.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

type Props = {
    message: string | null;
    onRetry: () => void;
};

export function StatsError({ message, onRetry }: Props) {
    const { t } = useTranslation();
    return (
        <View className="bg-red-50 rounded-xl p-4 items-center gap-2">
            <Text className="text-sm text-red-500 text-center">
                {message ?? t("transporter.stats.loadFailed")}
            </Text>
            <TouchableOpacity
                onPress={onRetry}
                className="bg-red-100 px-4 py-2 rounded-lg mt-1"
            >
                <Text className="text-sm font-semibold text-red-600">{t("transporter.stats.tryAgain")}</Text>
            </TouchableOpacity>
        </View>
    );
}