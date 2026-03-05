import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface Props {
    value?: string;
    placeholder?: string;
    data: { label: string; value: string }[];
    onChange: (value: string) => void;
}

export default function Dropdown({
    value,
    placeholder,
    data,
    onChange,
}: Props) {
    return (
        <View style={styles.container}>
            <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
            >
                <Picker.Item label={placeholder || "Select"} value="" />
                {data.map((item) => (
                    <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 8,
        marginBottom: 14,
    },
});