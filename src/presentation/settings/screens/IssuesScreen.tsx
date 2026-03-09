import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";

import { Issue } from "../../../domain/entities/Issue.entity";
import { SearchInput } from "../components/SearchInput";
import AppHeader from "../../../shared/components/AppHeader";
import IssuesTable from "../components/IssuesTable";

import { SettingsStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackNavigationProp<
    SettingsStackParamList,
    "IssueReported"
>;

const dummyIssues: Issue[] = [
    {
        _id: "1",
        shipment_id: "SHP001",
        transporter_id: "TR001",
        issue_title: "Furniture Delivery",
        reported_on: "2026-03-09",
        issue_description: "Delay in delivery due to traffic.",
        status: false,
        createdAt: "",
        updatedAt: "",
        __v: 0,
    },
    {
        _id: "2",
        shipment_id: "SHP002",
        transporter_id: "TR002",
        issue_title: "Electronics Shipment",
        reported_on: "2026-03-08",
        issue_description: "Damaged item during transit.",
        status: true,
        createdAt: "",
        updatedAt: "",
        __v: 0,
    },
];

const IssuesScreen = () => {

    const navigation = useNavigation<Props>();

    const [issues, setIssues] = useState<Issue[]>([]);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadIssues();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredIssues(issues);
        } else {
            setFilteredIssues(
                issues.filter((i) =>
                    i.issue_title.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, issues]);

    const loadIssues = async () => {

        setLoading(true);

        await new Promise((res) => setTimeout(res, 500));

        setIssues(dummyIssues);
        setFilteredIssues(dummyIssues);

        setLoading(false);
    };

    const handleView = (issue: Issue) => {

        Alert.alert(
            "Issue Details",
            `Title: ${issue.issue_title}
Description: ${issue.issue_description}
Status: ${issue.status ? "Resolved" : "Pending"}`
        );
    };

    const handleDelete = (issue: Issue) => {

        Alert.alert("Confirm Delete", "Delete this issue?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    setIssues((prev) =>
                        prev.filter((i) => i._id !== issue._id)
                    );
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

    return (
        <View className="flex-1 bg-white p-4">

            <AppHeader
                text="Issue Reported"
                onpress={() => navigation.goBack()}
            />

            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search issue"
            />

            <IssuesTable
                issues={filteredIssues}
                onView={handleView}
                onDelete={handleDelete}
            />

        </View>
    );
};

export default IssuesScreen;