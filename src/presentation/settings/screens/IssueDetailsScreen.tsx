import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import AppHeader from "../../../shared/components/AppHeader";
import { SettingsStackParamList } from "../../../navigation/types";
import { useIssue } from "../hooks/useIssue";

type Props = NativeStackNavigationProp<
    SettingsStackParamList,
    "IssueSummary"
>;

type RouteProps = RouteProp<SettingsStackParamList, "IssueSummary">;

const Row = ({ label, value }: { label: string; value?: string }) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-400 mb-1">{label}</Text>
        <Text className="text-sm font-medium text-gray-800">
            {value ?? "—"}
        </Text>
    </View>
);

const StatusBadge = ({ status }: { status: boolean }) => {
    const isResolved = status === true;

    return (
        <View
            className={`px-3 py-1 rounded-full ${isResolved ? "bg-green-500" : "bg-yellow-500"
                }`}
        >
            <Text className="text-white text-xs font-semibold">
                {isResolved ? "Resolved" : "Pending"}
            </Text>
        </View>
    );
};

export default function IssueSummaryScreen() {
    const navigation = useNavigation<Props>();
    const route = useRoute<RouteProps>();

    const issueId = route.params?.issueId;

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
        <ScrollView className="flex-1 bg-gray-100 px-4 pt-6">
            {/* Header */}
            <AppHeader text="Issue Summary" onpress={() => navigation.goBack()} />

            {/* Top Section */}
            <View className="flex-row justify-between items-center mb-4 mt-4">
                <Text className="text-base font-semibold text-gray-700">
                    #{issue._id}
                </Text>

                <StatusBadge status={issue.status} />
            </View>

            {/* Card */}
            <View className="bg-white rounded-2xl p-5 shadow-sm">
                <Row label="Issue Title" value={issue.issue_title} />
                <Row label="Shipment ID" value={issue.shipment_id} />
                <Row label="Transporter ID" value={issue.transporter_id} />
                <Row label="Reported On" value={issue.reported_on} />

                {/* Description */}
                <View className="mt-2">
                    <Text className="text-xs text-gray-400 mb-1">
                        Issue Description
                    </Text>
                    <Text className="text-sm text-gray-700 leading-5">
                        {issue.issue_description ?? "—"}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}