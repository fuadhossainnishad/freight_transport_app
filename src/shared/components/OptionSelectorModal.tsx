import React from "react"
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from "react-native"

type Props = {
    visible: boolean
    options: string[]
    onClose: () => void
    onSelect: (value: string) => void
}

export default function OptionSelectorModal({
    visible,
    options,
    onClose,
    onSelect,
}: Props) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity
                activeOpacity={1}
                onPress={onClose}
                className="flex-1 bg-black/40 justify-end"
            >
                <View className="bg-white rounded-t-2xl p-4 max-h-[50%]">
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => onSelect(item)}
                                className="p-4 border-b border-gray-200"
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    )
}