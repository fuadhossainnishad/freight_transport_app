import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import EditIcon from "../../../assets/icons/edit.svg";
import { DocPicker, PickedFile } from "./DocPicker";

interface Props {
    image?: PickedFile | null;
    onChange: (file: PickedFile) => void;
}

export default function ProfileImagePicker({ image, onChange }: Props) {
    const pickImage = async () => {
        const file = await DocPicker();
        if (file) {
            onChange(file);
        }
    };

    return (
        <View className="items-center mt-4">
            <View className="relative">
                {image?.uri ? (
                    <Image
                        source={{ uri: image.uri }}
                        className="w-24 h-24 rounded-full"
                    />
                ) : (
                    <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                        {/* Placeholder avatar — shown before user picks an image */}
                    </View>
                )}

                <TouchableOpacity
                    onPress={pickImage}
                    className="absolute bottom-0 right-0 bg-[#036BB4] p-2 rounded-full"
                >
                    <EditIcon width={16} height={16} />
                </TouchableOpacity>
            </View>
        </View>
    );
}