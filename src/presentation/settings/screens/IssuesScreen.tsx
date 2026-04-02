import React, { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import AppHeader from "../../../shared/components/AppHeader";
import { SearchInput } from "../components/SearchInput";
import IssuesTable from "../components/IssuesTable";

import { SettingsStackParamList } from "../../../navigation/types";
import { useIssues } from "../hooks/useIssues";
import { Issue } from "../../../domain/entities/Issue.entity";
import { useAuth } from "../../../app/context/Auth.context";
import { deleteIssueStatus } from "../../../domain/usecases/issue.usecase";
type Props = NativeStackNavigationProp<
    SettingsStackParamList,
    "IssueReported"
>;

const IssuesScreen = () => {
    const navigation = useNavigation<Props>();
    const { user } = useAuth()

    const { issues, setIssues, loading, error, loadIssues } =
        useIssues(user?.shipper_id!);

    const [search, setSearch] = useState("");

    useEffect(() => {
        loadIssues();
    }, [loadIssues]);

    const filteredIssues = useMemo(() => {
        if (!search.trim()) return issues;

        return issues.filter((i) =>
            i.issue_title.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, issues]);

    const handleView = (issue: Issue) => {
        navigation.navigate("IssueSummary", { issueId: issue?._id! });
    };

    const handleDelete = (issue: Issue) => {
        Alert.alert("Confirm Delete", "Delete this issue?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        // ✅ Call API
                        await deleteIssueStatus(issue._id);

                        // ✅ Update UI AFTER success
                        setIssues(prev =>
                            prev.filter(i => i._id !== issue._id)
                        );

                    } catch (err) {
                        Alert.alert("Error", "Failed to delete issue");
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-4">
                <AppHeader
                    text="Issue Reported"
                    onpress={() => navigation.goBack()}
                />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white p-4">
            {/* Header */}
            <AppHeader
                text="Issue Reported"
                onpress={() => navigation.goBack()}
            />

            {/* Search */}
            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search issue"
            />

            {/* Table */}
            <IssuesTable
                issues={filteredIssues}
                onView={handleView}
                onDelete={handleDelete}
            />
        </SafeAreaView>
    );
};

export default IssuesScreen;