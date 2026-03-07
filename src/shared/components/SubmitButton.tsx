import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

export interface SubmitButtonProps {
    text: string
    onSubmit: () => void
    loading?: boolean
}

export default function SubmitButton({ text, onSubmit, loading }: SubmitButtonProps) {
    return (
        <TouchableOpacity
            onPress={onSubmit}
            className="bg-[#036BB4] p-4 rounded-full"
            disabled={loading}
        >
            {loading ?
                <ActivityIndicator color="#fff" />
                :
                <Text className="text-white text-center font-semibold">
                    {text}
                </Text>
            }

        </TouchableOpacity>
    );
};
