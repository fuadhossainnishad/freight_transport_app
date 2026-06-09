import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from "react-native"
import { useFormContext } from "react-hook-form"
import { pick } from "@react-native-documents/picker"
import DocumentUpload from "../../../../../assets/icons/upload.svg"
import CheckCircle from "../../../../../assets/icons/circle.svg"
import { SafeAreaView } from "react-native-safe-area-context"

interface StepDocumentsProps {
  onSubmit: () => void
  loading?: boolean
}

const DocumentItem = ({
  title,
  field,
  file,
  onPickFile
}: {
  title: string
  field: string
  file: any
  onPickFile: (field: string, title: string) => void
}) => {
  const isImage = file?.type?.startsWith('image/')
  const fileName = file?.name || ''
  const fileSize = file?.size ? `${(file.size / 1024).toFixed(2)} KB` : ''

  return (
    <View className="mb-6">
      <Text className="text-base font-medium text-gray-700 mb-2">{title}</Text>

      <TouchableOpacity
        onPress={() => onPickFile(field, title)}
        className={`border-2 border-dashed rounded-xl p-4 ${file ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"
          }`}
        activeOpacity={0.7}
      >
        {file ? (
          // Preview when file is uploaded
          <View>
            {isImage ? (
              <Image
                source={{ uri: file.uri }}
                className="w-full h-40 rounded-lg mb-3"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center py-4 mb-2">
                <DocumentUpload width={40} height={40} color="#10B981" />
              </View>
            )}

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-gray-800" numberOfLines={1}>
                  {fileName || "Document uploaded"}
                </Text>
                {fileSize ? (
                  <Text className="text-xs text-gray-500 mt-0.5">{fileSize}</Text>
                ) : null}
              </View>
              <View className="flex-row items-center">
                <Text className="text-xs text-green-600 mr-2">Tap to change</Text>
                <CheckCircle width={18} height={18} color="#10B981" />
              </View>
            </View>
          </View>
        ) : (
          // Upload state
          <View className="items-center py-8">
            <DocumentUpload width={48} height={48} color="#6B7280" />
            <Text className="text-gray-600 mt-3">Tap to upload</Text>
            <Text className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 10MB)</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default function StepDocuments({ onSubmit, loading = false }: StepDocumentsProps) {
  const { setValue, watch } = useFormContext()

  const registrationCert = watch("registration_certificate")
  const transportLicense = watch("transport_license")
  const insuranceCert = watch("insurance_certificate")

  const pickFile = async (field: string, documentName: string) => {
    try {
      const result = await pick({
        allowMultiSelection: false,
        type: ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      })

      if (!result || result.length === 0) return

      const file = result[0]

      // Validate file size (10MB limit)
      if (file.size && file.size > 10 * 1024 * 1024) {
        Alert.alert("Error", "File size should be less than 10MB")
        return
      }

      const fileData = {
        uri: file.uri,
        name: file.name,
        type: file.type,
        size: file.size,
        fileName: file.name
      }

      setValue(field, fileData)
      Alert.alert("Success", `${documentName} uploaded successfully`)
    } catch (error) {
      console.error("File pick error:", error)
      Alert.alert("Error", "Failed to upload document. Please try again.")
    }
  }

  const isFormValid = () => {
    return registrationCert && transportLicense && insuranceCert
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="flex-1 justify-between">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <DocumentItem
          title="Registration Certificate"
          field="registration_certificate"
          file={registrationCert}
          onPickFile={pickFile}
        />

        <DocumentItem
          title="Transport License"
          field="transport_license"
          file={transportLicense}
          onPickFile={pickFile}
        />

        <DocumentItem
          title="Insurance Certificate"
          field="insurance_certificate"
          file={insuranceCert}
          onPickFile={pickFile}
        />
      </ScrollView>

      <View className="flex-row gap-4 mt-6 mb-4">
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!isFormValid() || loading}
          className={`flex-1 py-4 rounded-xl ${isFormValid() && !loading ? "bg-[#036BB4]" : "bg-gray-300"
            }`}
        >
          <Text className={`text-center font-semibold text-base ${isFormValid() && !loading ? "text-white" : "text-gray-500"
            }`}>
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}