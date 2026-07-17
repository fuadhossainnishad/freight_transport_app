import React from "react";
import { View, Text, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import IssueItem from "./IssueItem";
import { Issue } from "../../../domain/entities/Issue.entity";

interface Props {
  issues: Issue[];
  onView: (issue: Issue) => void;
  onDelete: (issue: Issue) => void;
}

const IssuesTable: React.FC<Props> = ({ issues, onView, onDelete }) => {
  const { t } = useTranslation();

  return (
    <View className="border border-gray-200 rounded-lg overflow-hidden mt-4">

      {/* Table Header */}
      <View className="flex-row bg-[#036BB4]">
        <View className="flex-1 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">{t("settings.issues.table.shipmentTitle")}</Text>
        </View>
        <View className="w-28 p-3 border-r border-gray-200">
          <Text className="text-white text-center font-semibold">{t("settings.issues.table.status")}</Text>
        </View>
        <View className="w-28 p-3">
          <Text className="text-white text-center font-semibold">{t("settings.issues.table.actions")}</Text>
        </View>
      </View>

      {/* Table Rows */}
      <FlatList
        data={issues}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <IssueItem
            issue={item}
            onViewPress={onView}
            onDeletePress={onDelete}
          />
        )}
        ListEmptyComponent={
          <View className="p-4">
            <Text className="text-center text-gray-500">{t("settings.issues.table.empty")}</Text>
          </View>
        }
      />
    </View>
  );
};

export default IssuesTable;