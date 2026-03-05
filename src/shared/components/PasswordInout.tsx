import { TextInput, TouchableOpacity, View } from "react-native";
import NotView from '../../../assets/icons/not_view.svg'
import { useState } from "react";

interface PasswordInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}

export default function PasswordInput({ placeholder, value, onChangeText }: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View className="">
            <TextInput
                className=""
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                secureTextEntry={!isVisible}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity
                // style={styles.eyeButton}
                onPress={() => setIsVisible((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
            >
                {
                    isVisible ?
                        <NotView height={12} width={12} />
                        :
                        <NotView height={12} width={12} />
                }
            </TouchableOpacity>
        </View>
    );
}
