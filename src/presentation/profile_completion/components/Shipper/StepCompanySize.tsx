import { View, Text, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import { User, Users, UsersRound, Building, Building2, Factory } from "lucide-react-native"
import WizardOptionCard from "../WizardOptionCard"

const ICON = "#036BB4"

const options = [
  { label: "1 - 5", value: "1-5", icon: <User size={26} color={ICON} /> },
  { label: "6 - 20", value: "6-20", icon: <Users size={26} color={ICON} /> },
  { label: "21 - 50", value: "21-50", icon: <UsersRound size={26} color={ICON} /> },
  { label: "51 - 200", value: "51-200", icon: <Building size={26} color={ICON} /> },
  { label: "201 - 500", value: "201-500", icon: <Building2 size={26} color={ICON} /> },
  { label: "More than 500", value: "500_Plus", icon: <Factory size={26} color={ICON} /> }
]

const cardWidth = (Dimensions.get("window").width - 52) / 2

export default function StepCompanySize({ next }: any) {
  const { setValue, watch } = useFormContext()
  const current = watch("employee_size")

  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-gray-900">
        What is the size of your company?
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {options.map((item) => (
          <WizardOptionCard
            key={item.value}
            label={item.label}
            sublabel="employees"
            selected={current === item.value}
            icon={item.icon}
            style={{ width: cardWidth }}
            onPress={() => {
              setValue("employee_size", item.value)
              next()
            }}
          />
        ))}
      </View>
    </View>
  )
}
