import { View, Text, TextInput, Button } from "react-native"
import { useFormContext } from "react-hook-form"

export default function StepCompanyInfo({ next }: any) {

    const { register, setValue } = useFormContext()

    return (
        <View>
            <Text>Company Address</Text>
            <TextInput
                onChangeText={(text) =>
                    setValue("company_address", text)
                }
            />

            <Button title="Next" onPress={next} />

        </View>
    )
}