import { Text, TextInput, TextInputProps, View } from "react-native";

export interface IFormInputField extends TextInputProps {
    containerClass?: string;
    containerEvent?: Record<string, any>;
    label?: string;
    labelEvent?: Record<string, any>;
    labelClass?: string;
    inputClass?: string;
}

export default function FormInputField({
    containerClass = "",
    containerEvent = {},
    label,
    labelClass = "",
    labelEvent = {},
    inputClass = "",
    ...props
}: IFormInputField) {
    return (
        <View className={containerClass} {...containerEvent}>
            {label && (
                <Text className={labelClass} {...labelEvent}>
                    {label}
                </Text>
            )}

            <TextInput
                className={inputClass}
                {...props}
            />
        </View>
    );
}
