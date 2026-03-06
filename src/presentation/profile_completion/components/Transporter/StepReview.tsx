import { View, Button, Text, Alert, ActivityIndicator } from "react-native"
import { useFormContext } from "react-hook-form"
import { CompleteTransporterProfileUseCase } from "../../../../domain/usecases/complete-transporter.usecase"
import { useUser } from "../../../../app/context/User.context"
import { useState } from "react"

export default function StepReview({
  back,
  onSuccess
}: {
  back: () => void
  onSuccess?: () => void
}) {

  const { getValues } = useFormContext()
  const { setUser, user } = useUser()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {

    try {

      setLoading(true)

      const data = getValues()

      const formData = new FormData()

      // ✅ Append form fields dynamically
      Object.keys(data).forEach((key) => {

        const value = data[key]

        if (!value) return

        if (value?.uri) {
          // File
          formData.append(key, {
            uri: value.uri,
            type: value.type,
            name: value.name
          } as any)
        } else {
          // Text
          formData.append(key, value)
        }

      })

      // ✅ Attach transporter ID from context
      formData.append("transporter_id", user?.id!)

      const res = await CompleteTransporterProfileUseCase.execute(formData)

      if (res?.success) {

        // ✅ Update Global Context
        setUser(prev => ({
          ...prev!,
          transporterProfile: res.data
        }))

        Alert.alert("Profile Completed ✅")

        // ✅ Let Wizard Handle Navigation
        onSuccess?.()
      }

    } catch (error) {

      console.error("Transporter profile error:", error)
      Alert.alert("Profile submission failed")

    } finally {
      setLoading(false)
    }
  }

  return (
    <View>

      <Text>Review & Submit</Text>

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