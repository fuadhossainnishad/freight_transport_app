import { View, Text, TextInput } from "react-native"
import { useFormContext } from "react-hook-form"
import { Building2, MapPin } from "lucide-react-native"

export default function StepCompanyAddress() {
  const { setValue, watch } = useFormContext()
  const address = watch("company_address")

  return (
    <View>
      <View className="flex-row items-center mb-1">
        <Building2 size={18} color="#036BB4" />
        <Text className="text-xs font-semibold text-[#036BB4] ml-1.5 uppercase tracking-wide">
          Basic information
        </Text>
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-1">
        Enter your company address
      </Text>
      <Text className="text-sm text-gray-500 mb-6">
        Where is your transport business located?
      </Text>

      <Text className="text-sm font-semibold text-gray-700 mb-1.5">
        Company address
      </Text>
      <View className="flex-row items-center gap-2 border border-gray-300 rounded-2xl px-4 min-h-[56px] py-2">
        <MapPin size={20} color="#94a3b8" />
        <TextInput
          className="flex-1 text-base text-gray-900 py-0"
          placeholder="House number, street, city (e.g. 123 Main Street, Dakar)"
          placeholderTextColor="#9ca3af"
          value={address ?? ""}
          onChangeText={(text) => setValue("company_address", text)}
          multiline
        />
      </View>
    </View>
  )
}
