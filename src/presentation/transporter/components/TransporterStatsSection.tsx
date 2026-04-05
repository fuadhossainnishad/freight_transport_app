// components/stats/StatsSection.tsx
import { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatStatus, TransporterStats } from "../hooks/useTransporterStats";
import { StatsSkeleton } from "./StatsSkeleton";
import { StatsError } from "./StatsError";
import StatCard from "../../../shared/components/StatCard";

// ─────────────────────────────
// TYPES
// ─────────────────────────────
type Props = {
    data: TransporterStats | null;
    status: StatStatus
    error: string | null;
    onRetry: () => void;
};

// ─────────────────────────────
// COMPONENT
// ─────────────────────────────
const TransporterStatsSection = memo(function TransporterStatsSection({
    data,
    status,
    error,
    onRetry,
}: Props) {

    // ── first load ──
    if (status === "idle" || status === "loading") {
        return <StatsSkeleton />;
    }

    // ── error with no data — nothing to show ──
    if (status === "error" && !data) {
        return <StatsError message={error} onRetry={onRetry} />;
    }

    // ── data exists ──
    return (
        <View className="gap-3">

            {/* fetching indicator — data still visible */}
            {status === "fetching" && (
                <View className="flex-row items-center gap-2 mb-1">
                    <View className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <Text className="text-xs text-gray-400">Updating...</Text>
                </View>
            )}

            {/* error banner — stale data still visible */}
            {status === "error" && data && (
                <View className="flex-row items-center justify-between bg-red-50 rounded-lg px-3 py-2 mb-1">
                    <Text className="text-xs text-red-500">
                        {error ?? "Failed to refresh"}
                    </Text>
                    <TouchableOpacity onPress={onRetry}>
                        <Text className="text-xs font-semibold text-red-600">Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View className="flex-row gap-3">
                <StatCard title="Shipments In Progress" value={data?.shipmentsInProgress || 0} />
                <StatCard title="Completed Shipments" value={data?.completedShipments || 0} />
            </View>

            <StatCard
                title="Total Earnings"
                value={`€${data?.totalEarnings || 0}`}
                fullWidth
            />

        </View>
    );
});

export default TransporterStatsSection