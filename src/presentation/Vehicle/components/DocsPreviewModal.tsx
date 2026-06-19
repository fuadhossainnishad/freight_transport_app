import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Image, ActivityIndicator, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { X, FileWarning, ExternalLink } from "lucide-react-native";

interface Props {
    visible: boolean;
    imageUri?: string;
    title?: string;
    onClose: () => void;
}

const isPdf = (uri?: string) => !!uri && /\.pdf(\?|$)/i.test(uri.trim());

const DocsPreviewModal: React.FC<Props> = ({ visible, imageUri, title = "Document", onClose }) => {
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);

    // Reset state whenever a new document is opened.
    useEffect(() => {
        if (visible) {
            setLoading(true);
            setErrored(false);
        }
    }, [visible, imageUri]);

    if (!imageUri) return null;

    const pdf = isPdf(imageUri);
    // Android's WebView can't render a raw PDF, so route PDFs through the
    // Google Docs viewer for consistent cross-platform rendering.
    const pdfSource = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(imageUri)}`;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 bg-black/95">
                {/* Top bar */}
                <View className="flex-row items-center justify-between px-5 pt-12 pb-4">
                    <Text className="text-white text-base font-semibold">{title}</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={12}>
                        <X size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="flex-1 items-center justify-center px-4 pb-8">
                    {errored ? (
                        <View className="items-center px-8">
                            <FileWarning size={44} color="#9CA3AF" strokeWidth={1.5} />
                            <Text className="text-gray-300 text-base font-semibold mt-4 text-center">
                                Couldn't load this document
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1 text-center leading-5">
                                The file may be unavailable or in an unsupported format.
                            </Text>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(imageUri)}
                                className="flex-row items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-white/10"
                            >
                                <ExternalLink size={16} color="#fff" />
                                <Text className="text-white font-semibold text-sm">Open externally</Text>
                            </TouchableOpacity>
                        </View>
                    ) : pdf ? (
                        <View className="flex-1 w-full rounded-xl overflow-hidden bg-white">
                            <WebView
                                source={{ uri: pdfSource }}
                                onLoadEnd={() => setLoading(false)}
                                onError={() => {
                                    setLoading(false);
                                    setErrored(true);
                                }}
                                startInLoadingState
                            />
                        </View>
                    ) : (
                        <Image
                            source={{ uri: imageUri }}
                            className="w-full h-full"
                            resizeMode="contain"
                            onLoadEnd={() => setLoading(false)}
                            onError={() => {
                                setLoading(false);
                                setErrored(true);
                            }}
                        />
                    )}

                    {loading && !errored && (
                        <ActivityIndicator
                            size="large"
                            color="#fff"
                            style={{ position: "absolute" }}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default DocsPreviewModal;
