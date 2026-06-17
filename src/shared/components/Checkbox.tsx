import { Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
    checked: boolean;
    onToggle: () => void;
    label: string;
}

export default function Checkbox({ checked, onToggle, label }: CheckboxProps) {
    return (
        <TouchableOpacity
            className="flex-row items-start gap-2.5"
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View
                className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${checked ? "bg-[#036BB4] border-[#036BB4]" : "border-gray-400"
                    }`}
            >
                {checked && (
                    <Text className="text-white text-xs font-bold leading-none">✓</Text>
                )}
            </View>

            <Text className="flex-1 text-sm text-gray-700 leading-5">{label}</Text>
        </TouchableOpacity>
    );
}