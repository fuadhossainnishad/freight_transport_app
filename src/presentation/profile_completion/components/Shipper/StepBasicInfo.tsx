import { View, Text, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useUser } from "../../../../app/context/User.context"
import { CompleteShipperProfileUseCase } from "../../../../domain/usecases/complete-shipper.usecase"
import { useAuth } from '../../../../app/context/Auth.context';

import Location from '../../../../../assets/icons/location.svg'

export default function StepBasicInfo({ onSuccess }: any) {

    const { setValue, watch, getValues } = useFormContext()
    const { setUser } = useUser()
    const { user: authUser } = useAuth()

    const [loading, setLoading] = useState(false)
    const address = watch("company_address")

    const handleSubmit = async () => {
        const data = getValues()
        if (!data.company_address?.trim()) {
            Alert.alert("Company address required", "Please enter your company address to finish.")
            return
        }

        try {
            setLoading(true)

            const payload = {
                shipper_id: authUser?.shipper_id!,
                ...data
            }

            const res = await CompleteShipperProfileUseCase.execute(payload)

            if (res?.success) {
                setUser(prev => ({
                    ...prev!,
                    shipperProfile: res.data
                }))
                onSuccess?.()
            }
        } catch (error) {
            console.error("Profile submit error:", error)
            Alert.alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <View className="gap-5">
            <View>
                <Text className="text-xl font-bold text-gray-900">
                    Almost done!
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                    Where is your company located?
                </Text>
            </View>

            <View>
                <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                    Company address
                </Text>
                <View className="flex-row items-center gap-2 border border-gray-300 rounded-xl px-4 h-[52px]">
                    <TextInput
                        className="flex-1 text-base text-gray-900 py-0"
                        placeholder="Enter company address"
                        placeholderTextColor="#9ca3af"
                        value={address ?? ""}
                        onChangeText={(text) => setValue("company_address", text)}
                    />
                    <Location height={26} width={26} />
                </View>
            </View>

            <TouchableOpacity
                className={`p-4 rounded-full flex-row items-center justify-center ${loading ? "bg-[#036BB4]/70" : "bg-[#036BB4]"}`}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
            >
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text className="text-white text-center font-semibold text-base">Finish</Text>}
            </TouchableOpacity>
        </View>
    )
}
