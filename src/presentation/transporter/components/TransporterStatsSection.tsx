// components/stats/StatsSection.tsx
import { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { StatStatus, TransporterStats } from "../hooks/useTransporterStats";
import { StatsSkeleton } from "./StatsSkeleton";
import { StatsError } from "./StatsError";
import StatCard from "../../../shared/components/StatCard";


type Props = {
    data: TransporterStats | null;
    status: StatStatus
    error: string | null;
    onRetry: () => void;
    selectedMonth: number | null;
    onMonthChange: (month: number) => void;
};

const TransporterStatsSection = memo(function TransporterStatsSection({
    data,
    status,
    error,
    onRetry,
    selectedMonth,
    onMonthChange,
}: Props) {
    const { t } = useTranslation();

    const isLoading = status === "loading" || status === "fetching";

    // ── error with no data — nothing to show ──
    if (status === "error" && !data) {
        return <StatsError message={error} onRetry={onRetry} />;
    }

    // ── data exists ──
    return (
        <View className="gap-3">
            {/* error banner — stale data still visible */}
            {status === "error" && data && (
                <View className="flex-row items-center justify-between bg-red-50 rounded-lg px-3 py-2 mb-1">
                    <Text className="text-xs text-red-500">
                        {error ?? t("transporter.stats.refreshFailed")}
                    </Text>
                    <TouchableOpacity onPress={onRetry}>
                        <Text className="text-xs font-semibold text-red-600">{t("common.retry")}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View className="flex-row gap-3">
                <StatCard 
                    title={t("transporter.stats.shipmentsInProgress")} 
                    value={data?.shipmentsInProgress || 0} 
                    selectedMonth={selectedMonth}
                    onMonthChange={onMonthChange}
                    isLoading={isLoading}
                />
                <StatCard 
                    title={t("transporter.stats.completedShipments")} 
                    value={data?.completedShipments || 0} 
                    selectedMonth={selectedMonth}
                    onMonthChange={onMonthChange}
                    isLoading={isLoading}
                />
            </View>

            <StatCard
                title={t("transporter.stats.totalEarnings")}
                value={`€${data?.totalEarnings || 0}`}
                fullWidth
                selectedMonth={selectedMonth}
                onMonthChange={onMonthChange}
                isLoading={isLoading}
            />

        </View>
    );
});

export default TransporterStatsSection