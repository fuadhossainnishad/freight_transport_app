import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { VehicleDocument } from "../../../domain/entities/vehicle";
import DocsIcon from "../../../../assets/icons/docs.svg";

interface Props {
    title: string;
    documents: VehicleDocument[];
    onPreview: (url: string) => void;
    fullWidth?: boolean;
}

const DocumentGrid: React.FC<Props> = ({
    title,
    documents,
    onPreview,
    fullWidth = false,
}) => {
    return (
        <View
            className={`
        ${fullWidth ? "w-full" : "w-[48%]"}
        mb-4 p-4 border border-gray-200 rounded-xl bg-white
      `}
        >
            <Text className="text-sm text-gray-500 font-semibold mb-3">
                {title}
            </Text>

            {/* Icons Grid */}
            <View className="flex-row flex-wrap justify-between">
                {documents.map((doc) => (
                    <TouchableOpacity
                        key={doc.id}
                        onPress={() => onPreview(doc.url)}
                        className="w-[48%]"
                    >
                        <DocsIcon height={24} width={24} />

                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default DocumentGrid;