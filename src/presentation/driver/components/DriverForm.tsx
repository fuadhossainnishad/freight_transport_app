// components/driver/DriverForm.tsx
import React from "react";
import { View, TextInput } from "react-native";

interface Props {
    form: {
        name: string;
        phone: string;
        email: string;
    };
    setForm: (val: any) => void;
}

export default function DriverForm({ form, setForm }: Props) {
    return (
        <View className="gap-3">

            <TextInput
                placeholder="Driver Name"
                value={form.name}
                onChangeText={(text) => setForm((prev: any) => ({ ...prev, name: text }))}
                className="border p-3 rounded-lg"
            />

            <TextInput
                placeholder="Number"
                value={form.phone}
                keyboardType="phone-pad"
                onChangeText={(text) => setForm((prev: any) => ({ ...prev, phone: text }))}
                className="border p-3 rounded-lg"
            />

            <TextInput
                placeholder="Email"
                value={form.email}
                keyboardType="email-address"
                onChangeText={(text) => setForm((prev: any) => ({ ...prev, email: text }))}
                className="border p-3 rounded-lg"
            />

        </View>
    );
}