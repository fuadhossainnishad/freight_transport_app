import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native"
import { useFormContext } from "react-hook-form"
import { CompleteTransporterProfileUseCase } from "../../../../domain/usecases/complete-transporter.usecase"
import { useUser } from "../../../../app/context/User.context"
import { useState } from "react"
import CheckCircle from "../../../../../assets/icons/circle.svg"
import FileIcon from "../../../../../assets/icons/upload.svg"

// --- Component moved outside to prevent unnecessary re-mounts ---
interface DocumentPreviewProps {
  label: string
  file: any
}

const DocumentPreview = ({ label, file }: DocumentPreviewProps) => {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <View className="flex-row items-center flex-1">
        <FileIcon width={20} height={20} color="#036BB4" />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-medium text-gray-800">{label}</Text>
          <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
            {file?.name || "Not uploaded"}
          </Text>
        </View>
      </View>
      {file && <CheckCircle width={18} height={18} color="#10B981" />}
    </View>
  )
}
// ----------------------------------------------------------------

interface StepReviewProps {
  back: () => void
  onSuccess?: () => void
}

export default function StepReview({ back, onSuccess }: StepReviewProps) {
  const { getValues } = useFormContext()
  const { setUser, user } = useUser()
  const [loading, setLoading] = useState(false)

  const values = getValues()

  const documents = [
    { label: "Registration Certificate", file: values.registration_certificate, key: "registration_certificate" },
    { label: "Transport License", file: values.transport_license, key: "transport_license" },
    { label: "Insurance Certificate", file: values.insurance_certificate, key: "insurance_certificate" }
  ]

  const handleSubmit = async () => {
    if (!documents.every(doc => doc.file)) {
      Alert.alert("Missing Documents", "Please upload all required documents before submitting.")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      // Append documents
      documents.forEach((doc) => {
        if (doc.file?.uri) {
          formData.append(doc.key, {
            uri: doc.file.uri,
            type: doc.file.type,
            name: doc.file.name
          } as any)
        }
      })

      // Append transporter ID
      formData.append("transporter_id", user?.id!)

      const res = await CompleteTransporterProfileUseCase.execute(formData)

      if (res?.success) {
        setUser(prev => ({
          ...prev!,
          transporterProfile: res.data
        }))

        Alert.alert(
          "Success!",
          "Your profile has been completed successfully.",
          [{ text: "Continue", onPress: () => onSuccess?.() }]
        )
      } else {
        throw new Error(res?.message || "Submission failed")
      }
    } catch (error: any) {
      console.error("Transporter profile error:", error)
      Alert.alert(
        "Submission Failed",
        error?.message || "Unable to complete profile. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const isFormComplete = documents.every(doc => doc.file)

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
    >
      <View className="flex-1 justify-between">
        <View>
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-2">Review Your Documents</Text>
            <Text className="text-sm text-gray-500">
              Please verify that all documents are correct before submitting
            </Text>
          </View>

          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            {documents.map((doc, index) => (
              <DocumentPreview key={index} label={doc.label} file={doc.file} />
            ))}
          </View>

          <View className="bg-blue-50 rounded-xl p-4">
            <Text className="text-sm text-blue-800 font-medium mb-2">Note:</Text>
            <Text className="text-xs text-blue-700">
              By submitting, you confirm that all provided documents are authentic and up-to-date.
              These documents will be verified by our team within 24-48 hours.
            </Text>
          </View>
        </View>

        <View className="flex-row gap-4 mt-8">
          <TouchableOpacity
            onPress={back}
            className="flex-1 py-4 rounded-xl border border-[#036BB4]"
            activeOpacity={0.7}
          >
            <Text className="text-center text-[#036BB4] font-semibold text-base">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !isFormComplete}
            className={`flex-1 py-4 rounded-xl ${!loading && isFormComplete ? "bg-[#036BB4]" : "bg-gray-300"
              }`}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-center text-white font-semibold text-base">
                Create Profile
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}