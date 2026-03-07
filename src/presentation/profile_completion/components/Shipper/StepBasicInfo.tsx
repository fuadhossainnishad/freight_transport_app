import { View, Text, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useUser } from "../../../../app/context/User.context"
import { CompleteShipperProfileUseCase } from "../../../../domain/usecases/complete-shipper.usecase"
import { useAuth } from '../../../../app/context/Auth.context';

import Location from '../../../../../assets/icons/location.svg'

export default function StepBasicInfo({ back, onSuccess }: any) {

    const { setValue, getValues } = useFormContext()
    const { setUser } = useUser()
    const { user: authUser } = useAuth()

    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {

        const data = getValues()
        console.log("StepBasicInfo:", data)
        if (!data.company_address) {
            Alert.alert("Company address required")
            return
        }

        try {

            setLoading(true)

            const payload = {
                shipper_id: authUser?.shipper_id!,
                ...data
            }
            console.log("StepBasicInfo:", payload)

            const res = await CompleteShipperProfileUseCase.execute(payload)

            if (res?.success) {

                // ✅ Update Global State
                setUser(prev => ({
                    ...prev!,
                    shipperProfile: res.data
                }))

                // ✅ Let Wizard Handle Navigation
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
        <View className="gap-4">

            <Text className="font-semibold text-xl">
                Company Address</Text>
            <View
                className="flex-row justify-between items-center gap-2 border border-black/10 px-4 py-2 font-semibold rounded-lg mb-4"
            >
                <TextInput
                    placeholder="Enter company address"
                    onChangeText={(text) =>
                        setValue("company_address", text)
                    }
                />
                <Location height={36} width={36} />
            </View>
            <TouchableOpacity
                className="bg-[#036BB4] p-4 rounded-full flex-row items-center justify-center "
                onPress={back}>
                <Text className="text-white text-center font-semibold">
                    Back
                </Text>
                {/* <Arrow height={16} width={16} /> */}
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="small" />
            ) : (
                <TouchableOpacity
                    className="bg-[#036BB4] p-4 rounded-full flex-row items-center justify-center "
                    onPress={handleSubmit}>
                    <Text className="text-white text-center font-semibold">
                        Create
                    </Text>
                    {/* <Arrow height={16} width={16} /> */}
                </TouchableOpacity>
            )}

        </View>
    )
}