import React from "react"
import { View } from "react-native"

type Props = {
    step: number
}

export default function StepIndicator({ step }: Props) {
    return (
        <View className="flex-row gap-2 px-4 mb-6">

            <View
                className={`flex-1 h-2 rounded-full ${step === 0 ? "bg-[#036BB4]" : "bg-gray-300"
                    }`}
            />

            <View
                className={`flex-1 h-2 rounded-full ${step === 1 ? "bg-[#036BB4]" : "bg-gray-300"
                    }`}
            />

        </View>
    )
}