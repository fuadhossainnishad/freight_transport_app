import { View, Text, TouchableOpacity, Alert, Image } from "react-native"
import { useFormContext } from "react-hook-form"
import { pick } from "@react-native-documents/picker"
import { UploadCloud, FileText, CheckCircle2, RefreshCw } from "lucide-react-native"

const BLUE = "#036BB4"
const GREEN = "#10B981"

interface StepDocumentUploadProps {
  /** Form field name, e.g. "registration_certificate" */
  field: string
  /** Small category label above the title, e.g. "Documentation" */
  category: string
  /** Step title, e.g. "Upload registration certificate" */
  title: string
  /** Sub label naming the document, e.g. "Company Registration Certificate" */
  documentLabel: string
}

export default function StepDocumentUpload({
  field,
  category,
  title,
  documentLabel,
}: StepDocumentUploadProps) {
  const { setValue, watch } = useFormContext()
  const file = watch(field)

  const isImage = file?.type?.startsWith("image/")
  const fileSize = file?.size ? `${(file.size / 1024).toFixed(0)} KB` : ""

  const pickFile = async () => {
    try {
      const result = await pick({
        allowMultiSelection: false,
        type: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
      })

      if (!result || result.length === 0) return

      const picked = result[0]

      if (picked.size && picked.size > 10 * 1024 * 1024) {
        Alert.alert("File too large", `${documentLabel} must be smaller than 10MB.`)
        return
      }

      setValue(field, {
        uri: picked.uri,
        name: picked.name,
        type: picked.type,
        size: picked.size,
      })
    } catch (error) {
      console.error("File pick error:", error)
      Alert.alert("Upload failed", "Failed to upload document. Please try again.")
    }
  }

  return (
    <View>
      <View className="flex-row items-center mb-1">
        <FileText size={18} color={BLUE} />
        <Text className="text-xs font-semibold text-[#036BB4] ml-1.5 uppercase tracking-wide">
          {category}
        </Text>
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-1">{title}</Text>
      <Text className="text-sm text-gray-500 mb-6">{documentLabel}</Text>

      <TouchableOpacity
        onPress={pickFile}
        activeOpacity={0.8}
        className={`rounded-2xl border ${
          file ? "border-green-200 bg-green-50" : "border-dashed border-gray-300 bg-gray-50"
        } p-5`}
      >
        {file ? (
          <View className="flex-row items-center">
            {isImage ? (
              <Image
                source={{ uri: file.uri }}
                className="w-16 h-16 rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-16 h-16 rounded-xl bg-white items-center justify-center border border-green-100">
                <FileText size={28} color={GREEN} />
              </View>
            )}

            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>
                {file.name || "Document uploaded"}
              </Text>
              <View className="flex-row items-center mt-1">
                <CheckCircle2 size={14} color={GREEN} />
                <Text className="text-xs text-green-600 ml-1 font-medium">
                  Uploaded{fileSize ? ` · ${fileSize}` : ""}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <RefreshCw size={16} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1">Change</Text>
            </View>
          </View>
        ) : (
          <View className="items-center py-8">
            <View className="w-14 h-14 rounded-full bg-[#036BB4]/10 items-center justify-center">
              <UploadCloud size={28} color={BLUE} />
            </View>
            <Text className="text-base font-semibold text-gray-800 mt-3">Upload PDF</Text>
            <Text className="text-sm text-gray-500 mt-1">Tap to upload a document</Text>
            <Text className="text-xs text-gray-400 mt-2">Max 10MB · PDF, JPG, PNG</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}
