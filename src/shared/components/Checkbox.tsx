import { Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
    checked: boolean;
    onToggle: () => void;
    label: string;
}

export default function Checkbox({ checked, onToggle, label }: CheckboxProps) {
    return (
        <TouchableOpacity
            className=""
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View
                className={``}            >
                {checked && <Text className="">✓</Text>}
            </View>
            <Text className="">{label}</Text>
        </TouchableOpacity>
    );
}