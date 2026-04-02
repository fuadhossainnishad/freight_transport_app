import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import AppHeader from "../../../shared/components/AppHeader";
import { SettingsStackParamList } from "../../../navigation/types";
import { useIssue } from "../hooks/useIssue";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackNavigationProp<
    SettingsStackParamList,
    "IssueSummary"
>;

type RouteProps = RouteProp<SettingsStackParamList, "IssueSummary">;

const Row = ({ label, value }: { label: string; value?: string }) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-700 mb-1">{label}</Text>
        <Text className="text-sm font-medium text-black">
            {value ?? "—"}
        </Text>
    </View>
);

const StatusBadge = ({ status }: { status: boolean }) => {
    const isResolved = status === true;

    return (
        <View
            className={`px-4 py-2 rounded-lg ${isResolved ? "bg-green-500" : "bg-yellow-500"
                }`}
        >
            <Text className="text-white text-sm font-semibold">
                {isResolved ? "Resolved" : "Pending"}
            </Text>
        </View>
    );
};

export default function IssueSummaryScreen() {
    const navigation = useNavigation<Props>();
    const route = useRoute<RouteProps>();

    const issueId = route.params?.issueId!;

    const { issue, loading, error } = useIssue(issueId);

    // ---------------- LOADING STATE ----------------
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <ActivityIndicator size="large" />
                <Text className="text-gray-500 mt-2">Loading issue...</Text>
            </View>
        );
    }

    // ---------------- ERROR STATE ----------------
    if (error || !issue) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100 px-4">
                <Text className="text-red-500 font-semibold text-center">
                    Failed to load issue
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 px-4 bg-white">
            <AppHeader text="Issue Summary" onpress={() => navigation.goBack()} />
            <ScrollView className="flex-1  px-4">
                {/* Header */}

                {/* Top Section */}
                <View className="flex-row justify-between items-center mb-4 mt-4">
                    <Text className="text-base font-semibold text-gray-700">
                        #{issue.issue_id}
                    </Text>

                    <StatusBadge status={issue.status} />
                </View>

                {/* Card */}
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-400">
                    <Row label="Issue Title" value={issue.issue_title} />
                    <Row label="Shipment ID" value={issue.shipment_id} />
                    <Row label="Transporter Name" value={issue.transporter_name} />
                    <Row label="Reported On" value={issue.reported_on} />

                    {/* Description */}
                    <View className="mt-2">
                        <Text className="text-sm text-gray-700 mb-1">
                            Issue Description
                        </Text>
                        <Text className="text-sm text-black font-medium leading-5">
                            {issue.issue_description ?? "—"}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}