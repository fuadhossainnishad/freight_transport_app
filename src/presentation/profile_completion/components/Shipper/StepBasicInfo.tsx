import { View, Text, TextInput, Button, ActivityIndicator } from "react-native"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useUser } from "../../../../app/context/User.context"
import { CompleteShipperProfileUseCase } from "../../../../domain/usecases/complete-shipper.usecase"

export default function StepBasicInfo({ back, onSuccess }: any) {

    const { setValue, getValues } = useFormContext()
    const { user } = useUser()

    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {

        const data = getValues()

        if (!data.company_address) {
            alert("Company address required")
            return
        }

        try {

            setLoading(true)

            const payload = {
                shipper_id: user?.id,
                ...data
            }

            const res = await CompleteShipperProfileUseCase.execute(payload)

            if (res?.success) {
                onSuccess?.()
            }

        } catch (error) {
            console.error("Profile submit error:", error)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <View>

            <Text>Company Address</Text>

            <TextInput
                placeholder="Enter company address"
                style={{ borderWidth: 1, padding: 10 }}
                onChangeText={(text) =>
                    setValue("company_address", text)
                }
            />

            <Text style={{ marginTop: 20 }}>
                I accept terms & conditions
            </Text>

            <Button title="Back" onPress={back} />

            {loading ? (
                <ActivityIndicator size="small" />
            ) : (
                <Button
                    title="Create"
                    onPress={handleSubmit}
                />
            )}

        </View>
    )
}