import React from "react";
import { View, Text, Modal, TouchableOpacity, Image } from "react-native";

interface Props {
    visible: boolean;
    imageUri?: string;
    onClose: () => void;
}

const DocsPreviewModal: React.FC<Props> = ({
    visible,
    imageUri,
    onClose,
}) => {
    if (!imageUri) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black justify-center items-center">

                {/* Close Button */}
                <TouchableOpacity
                    className="absolute top-12 right-6 z-10"
                    onPress={onClose}
                >
                    <Text className="text-white text-xl">✕</Text>
                </TouchableOpacity>

                {/* Image */}
                <Image
                    source={{ uri: imageUri }}
                    className="w-full h-[80%]"
                    resizeMode="contain"
                />
            </View>
        </Modal>
    );
};

export default DocsPreviewModal;