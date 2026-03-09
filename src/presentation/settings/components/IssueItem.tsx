import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Issue } from "../../../domain/entities/Issue.entity";
import Delete from "../../../../assets/icons/delete.svg";
import ViewIcon from "../../../../assets/icons/view2.svg";

interface Props {
    issue: Issue;
    onViewPress: (issue: Issue) => void;
    onDeletePress: (issue: Issue) => void;
}

const IssueItem: React.FC<Props> = ({ issue, onViewPress, onDeletePress }) => {
    return (
        <View className="flex-row border-t border-gray-200 bg-white">

            {/* Shipment Title */}
            <View className="flex-1 p-3 border-r border-gray-200 justify-center">
                <Text className="text-gray-800 font-medium">{issue.issue_title}</Text>
            </View>

            {/* Status */}
            <View className="w-28 p-3 border-r border-gray-200 items-center justify-center">
                <Text
                    className={`px-2 py-1 rounded text-black text-xs ${issue.status ? "bg-green-500" : "bg-orange-500"
                        }`}
                >
                    {issue.status ? "Resolved" : "Pending"}
                </Text>
            </View>

            {/* Actions */}
            <View className="w-28 flex-row items-center justify-center space-x-3">
                <TouchableOpacity
                    className="bg-[#9900FF]/10 p-2 rounded-full"
                    onPress={() => onViewPress(issue)}
                >
                    <ViewIcon width={16} height={16} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#FF0000]/10 p-2 rounded-full"
                    onPress={() => onDeletePress(issue)}
                >
                    <Delete width={16} height={16} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default IssueItem;