import { View, Button, Text, Alert } from "react-native"
import { useFormContext } from "react-hook-form"
import { CompleteTransporterProfileUseCase } from "@/domain/profile_completion/usecases/complete-transporter.usecase"

export default function StepReview({ back }: any) {

    const { getValues } = useFormContext()

    const handleSubmit = async () => {

        const data = getValues()

        const formData = new FormData()

        Object.keys(data).forEach(key => {

            const value = data[key]

            if (value?.uri) {
                formData.append(key, {
                    uri: value.uri,
                    type: value.type,
                    name: value.name
                } as any)
            } else {
                formData.append(key, value)
            }

        })

        await CompleteTransporterProfileUseCase.execute(formData)

        Alert(("Profile Completed ✅"))

    }

    return (
        <View>

            <Text>Review & Submit</Text>

            <Button title="Back" onPress={back} />
            <Button title="Create" onPress={handleSubmit} />

        </View>
    )
}