import { View, Button, Text } from "react-native"
import { useFormContext } from "react-hook-form"
import { pick } from "@react-native-documents/picker"


export default function StepDocuments({ next, back }: any) {

  const { setValue } = useFormContext()

  const pickFile = async (field: string) => {

    try {

      const result = await pick({
        allowMultiSelection: false,
        type: ["*/*"] // accept all files
      })

      if (!result || result.length === 0) return

      const file = result[0]

      setValue(field, {
        uri: file.uri,
        name: file.name,
        type: file.type
      })

    } catch (error) {

      console.log("File pick error:", error)


    }

  }

  return (
    <View>

      <Text>Registration Certificate</Text>
      <Button
        title="Upload"
        onPress={() =>
          pickFile("registration_certificate")
        }
      />
      <Text>Transport license</Text>
      <Button
        title="Upload"
        onPress={() =>
          pickFile("transport_license")
        }
      />
      <Text>Insurance Certificate</Text>
      <Button
        title="Upload"
        onPress={() =>
          pickFile("insurance_certificate")
        }
      />

      <Button title="Back" onPress={back} />
      <Button title="Next" onPress={next} />

    </View>
  )
}