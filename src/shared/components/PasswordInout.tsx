import { TextInput, TouchableOpacity, View } from "react-native";
import NotView from '../../../assets/icons/not_view.svg'
import { Eye } from "lucide-react-native";
import { useState } from "react";

interface PasswordInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}

export default function PasswordInput({ placeholder, value, onChangeText }: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View className="flex-row items-center">
            <TextInput
                className="flex-1 text-base text-gray-900 py-0"
                style={{ height: 50 }}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                secureTextEntry={!isVisible}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity
                className="pl-3"
                onPress={() => setIsVisible((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
            >
                {isVisible
                    ? <Eye height={20} width={20} color="#6b7280" />
                    : <NotView height={20} width={20} />}
            </TouchableOpacity>
        </View>
    );
}
