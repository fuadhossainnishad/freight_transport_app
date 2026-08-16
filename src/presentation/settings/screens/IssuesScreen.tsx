import React, { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
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
        Alert.alert(t("settings.issues.deleteTitle"), t("settings.issues.deleteMessage"), [
            { text: t("common.cancel"), style: "cancel" },
            {
                text: t("common.delete"),
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
                        Alert.alert(t("common.error"), t("settings.issues.deleteFailed"));
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
        // MISSING_SHIPPER is a sentinel code from useIssues, not display text.
        const message =
            error === "MISSING_SHIPPER"
                ? t("settings.issues.missingShipper")
                : t("settings.issues.loadError");

        return (
            <SafeAreaView edges={["top"]} className="flex-1 bg-white">
                <AppHeader
                    text={t("settings.issues.title")}
                    onpress={() => navigation.goBack()}
                />
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-center text-gray-500">{message}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white p-4">
            {/* Header */}
            <AppHeader
                text={t("settings.issues.title")}
                onpress={() => navigation.goBack()}
            />

            {/* Search */}
            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={t("settings.issues.searchPlaceholder")}
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