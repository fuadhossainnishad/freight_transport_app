import { Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
    checked: boolean;
    onToggle: () => void;
    label: string;
}

export default function Checkbox({ checked, onToggle, label }: CheckboxProps) {
    return (
        <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View
                className={`w-5 h-5 rounded border-2 ${checked ? "bg-[#036BB4] border-[#036BB4]" : "border-gray-400"
                    }`}
            >
                <View
                    className={``}            >
                    {checked && <Text className="">✓</Text>}
                </View>
            </View>

            <Text className="">{label}</Text>
        </TouchableOpacity>
    );
}