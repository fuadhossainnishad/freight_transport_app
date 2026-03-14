import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import EditIcon from "../../../assets/icons/edit.svg";
import { DocPicker, PickedFile } from "./DocPicker";

interface Props {
    image?: PickedFile | null;
    onChange: (file: PickedFile) => void;
}

export default function ProfileImagePicker({ image, onChange }: Props) {

    // const pickImage = async () => {
    //     const result = await launchImageLibrary({
    //         mediaType: "photo",
    //         quality: 0.8,
    //     });

    //     if (result.assets && result.assets.length > 0) {
    //         const uri = result.assets[0].uri;
    //         if (uri) {
    //             onChange(uri);
    //         }
    //     }
    // };
    const pickImage = async () => {
        const file = await DocPicker();

        if (file) {
            onChange(file);
        }
    };

    return (
        <View className="items-center mt-4">

            <View className="relative">

                <Image
                    source={{
                        uri: image?.uri || "https://i.pravatar.cc/300",
                    }}
                    className="w-24 h-24 rounded-full"
                />

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