import React from "react"
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from "react-native"

/**
 * A plain string is both the label and the value (legacy callers).
 * The object form separates them, which is required wherever the value is an
 * API value that must stay untranslated while the label is localised.
 */
export type SelectorOption = string | { value: string; label: string }

type Props = {
    visible: boolean
    options: SelectorOption[]
    onClose: () => void
    /** Always receives the VALUE, never the translated label. */
    onSelect: (value: string) => void
}

export default function OptionSelectorModal({
    visible,
    options,
    onClose,
    onSelect,
}: Props) {
    const items = options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option,
    )

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity
                activeOpacity={1}
                onPress={onClose}
                className="flex-1 bg-black/40 justify-end"
            >
                <View className="bg-white rounded-t-2xl p-4 max-h-[50%]">
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => onSelect(item.value)}
                                className="p-4 border-b border-gray-200"
                            >
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    )
}
