// UploadField.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { launchImageLibrary, Asset } from "react-native-image-picker";

interface Props {
    label: string;
    files: string[]; // current selected files
    onPress: (files: string[]) => void; // callback with selected files
}

const UploadField: React.FC<Props> = ({ label, files, onPress }) => {
    const handlePickFiles = () => {
        launchImageLibrary(
            {
                mediaType: "photo",
                selectionLimit: 0, // 0 = multiple selection
            },
            (response) => {
                if (response.didCancel) return; // user cancelled
                if (response.errorCode) {
                    Alert.alert("Error", response.errorMessage || "Failed to pick files");
                    return;
                }

                if (response.assets) {
                    const uris = response.assets.map((asset: Asset) => asset.uri!).filter(Boolean);
                    onPress([...files, ...uris]); // append new files
                }
            }
        );
    };

    return (
        <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>

            <TouchableOpacity
                onPress={handlePickFiles}
                className="border-2 border-dashed border-gray-300 rounded-xl py-6 items-center"
            >
                <Text className="text-gray-400">Tap to upload</Text>
            </TouchableOpacity>

            {/* Preview selected files */}
            {files.length > 0 && (
                <View className="mt-2 flex-row flex-wrap">
                    {files.map((uri, idx) => (
                        <Text key={idx} className="text-xs text-gray-500 mr-2 mb-1">
                            {uri.split("/").pop()}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
};

export default UploadField;