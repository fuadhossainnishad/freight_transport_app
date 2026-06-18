import { View, Text } from "react-native"
import { useFormContext } from "react-hook-form"
import { FileText, CheckCircle2, ShieldCheck, MapPin } from "lucide-react-native"

const GREEN = "#10B981"
const BLUE = "#036BB4"

const DOCUMENTS = [
  { key: "registration_certificate", label: "Registration Certificate" },
  { key: "transport_license", label: "Transport License" },
]

const DocRow = ({ label, file }: { label: string; file: any }) => (
  <View className="flex-row items-center py-3.5 border-b border-gray-100">
    <View className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-gray-100">
      <FileText size={20} color={BLUE} />
    </View>
    <View className="flex-1 ml-3">
      <Text className="text-sm font-semibold text-gray-900">{label}</Text>
      <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
        {file?.name || "Not uploaded"}
      </Text>
    </View>
    {file ? <CheckCircle2 size={20} color={GREEN} /> : null}
  </View>
)

export default function StepReview() {
  const { getValues } = useFormContext()
  const values = getValues()

  return (
    <View>
      <Text className="text-xl font-bold text-gray-900 mb-1">Review & submit</Text>
      <Text className="text-sm text-gray-500 mb-6">
        Make sure everything looks right before submitting for verification.
      </Text>

      <View className="bg-gray-50 rounded-2xl px-4 mb-6">
        {/* Company address */}
        <View className="flex-row items-center py-3.5 border-b border-gray-100">
          <View className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-gray-100">
            <MapPin size={20} color={BLUE} />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-sm font-semibold text-gray-900">Company Address</Text>
            <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={2}>
              {(values as any).company_address?.trim() || "Not provided"}
            </Text>
          </View>
          {(values as any).company_address?.trim() ? (
            <CheckCircle2 size={20} color={GREEN} />
          ) : null}
        </View>

        {DOCUMENTS.map((doc) => (
          <DocRow key={doc.key} label={doc.label} file={(values as any)[doc.key]} />
        ))}
      </View>

      <View className="flex-row bg-[#036BB4]/5 rounded-2xl p-4">
        <ShieldCheck size={20} color={BLUE} />
        <View className="flex-1 ml-3">
          <Text className="text-sm font-semibold text-[#036BB4] mb-1">Before you submit</Text>
          <Text className="text-xs text-[#036BB4]/80 leading-5">
            By submitting, you confirm these details are authentic and up to date.
          </Text>
        </View>
      </View>
    </View>
  )
}
