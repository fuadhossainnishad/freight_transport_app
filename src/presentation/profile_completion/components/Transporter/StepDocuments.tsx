import { View, Button, Text } from "react-native"
import * as DocumentPicker from "expo-document-picker"
import { useFormContext } from "react-hook-form"

export default function StepDocuments({ next, back }: any) {

  const { setValue } = useFormContext()

  const pickFile = async (field: string) => {

    const res = await DocumentPicker.getDocumentAsync({})

    if (res.assets) {

      const file = res.assets[0]

      setValue(field, {
        uri: file.uri,
        type: file.mimeType,
        name: file.name
      })

    }

  }

  return (
    <View>

      <Text>Upload Registration Certificate</Text>
      <Button
        title="Upload"
        onPress={() =>
          pickFile("registration_certificate")
        }
      />

      <Text>Upload Insurance</Text>
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