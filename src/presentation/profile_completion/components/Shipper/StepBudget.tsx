import { View, Text, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import { Coins, Banknote, Wallet, TrendingUp } from "lucide-react-native"
import WizardOptionCard from "../WizardOptionCard"

const ICON = "#036BB4"

const options = [
  { label: "Less than 2,500", value: "lt-2500", icon: <Coins size={26} color={ICON} /> },
  { label: "2,500 – 10,000", value: "2500-10000", icon: <Banknote size={26} color={ICON} /> },
  { label: "10,000 – 50,000", value: "10000-50000", icon: <Wallet size={26} color={ICON} /> },
  { label: "More than 50,000", value: "gt-50000", icon: <TrendingUp size={26} color={ICON} /> }
]

const cardWidth = (Dimensions.get("window").width - 52) / 2

export default function StepBudget({ next }: any) {
  const { setValue, watch } = useFormContext()
  const current = watch("monthly_budget_for_shipment")

  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-gray-900">
        What is your monthly budget for shipments?
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {options.map((item) => (
          <WizardOptionCard
            key={item.value}
            label={item.label}
            selected={current === item.value}
            icon={item.icon}
            style={{ width: cardWidth }}
            onPress={() => {
              setValue("monthly_budget_for_shipment", item.value)
              next()
            }}
          />
        ))}
      </View>
    </View>
  )
}
