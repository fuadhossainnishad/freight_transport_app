import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import Upload from "../../../assets/icons/upload.svg";
import AddIcon from "../../../assets/icons/add.svg";


interface Props {
    label: string;
    files: string[];
    onPress: (files: string[]) => void;
    multiple?: boolean;
}

const THUMB_SIZE = 80;

const UploadField: React.FC<Props> = ({ label, files, onPress, multiple = false }) => {
    const handlePickFiles = () => {
        launchImageLibrary(
            { mediaType: "photo", selectionLimit: multiple ? 0 : 1 },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    Alert.alert("Error", response.errorMessage || "Failed to pick files");
                    return;
                }
                if (response.assets) {
                    const uris = response.assets
                        .map((asset: Asset) => asset.uri!)
                        .filter(Boolean);
                    onPress(multiple ? [...files, ...uris] : uris);
                }
            }
        );
    };

    const handleRemove = (indexToRemove: number) => {
        onPress(files.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <View className="mb-5 flex-1">
            <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>

            {/* Upload button — only when no files selected */}
            {files.length === 0 && (
                <TouchableOpacity
                    onPress={handlePickFiles}
                    className="border-2 border-dashed border-gray-300 rounded-xl px-3 py-5 gap-2 items-center"
                >
                    <Upload height={20} width={20} />
                    <Text className="text-gray-400 text-xs">Upload Image</Text>
                </TouchableOpacity>
            )}

            {/* Thumbnails */}
            {files.length > 0 && (
                <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
                    {files.map((uri, idx) => (
                        <View
                            key={idx}
                            style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                        >
                            <Image
                                source={{ uri }}
                                style={{
                                    width: THUMB_SIZE,
                                    height: THUMB_SIZE,
                                    borderRadius: 10,
                                }}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                onPress={() => handleRemove(idx)}
                                style={{
                                    position: "absolute",
                                    top: -6,
                                    right: -6,
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: "#EF4444",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add more — multi only */}
                    {multiple && (
                        <TouchableOpacity
                            onPress={handlePickFiles}
                            style={{
                                width: THUMB_SIZE,
                                height: THUMB_SIZE,
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: "#D1D5DB",
                                borderStyle: "dashed",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <AddIcon height={20} width={20} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

export default UploadField;