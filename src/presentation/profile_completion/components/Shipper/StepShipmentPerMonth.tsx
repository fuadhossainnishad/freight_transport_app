import { View, Text, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import { Package, PackagePlus, Boxes, Truck, Container } from "lucide-react-native"
import WizardOptionCard from "../WizardOptionCard"

const ICON = "#036BB4"

const options = [
  { label: "0 - 5", value: "0-5", icon: <Package size={26} color={ICON} /> },
  { label: "6 - 10", value: "6-10", icon: <PackagePlus size={26} color={ICON} /> },
  { label: "11 - 50", value: "11-50", icon: <Boxes size={26} color={ICON} /> },
  { label: "50 - 200", value: "50-200", icon: <Truck size={26} color={ICON} /> },
  { label: "200+", value: "200_plus", icon: <Container size={26} color={ICON} /> }
]

const cardWidth = (Dimensions.get("window").width - 52) / 2

export default function StepShipmentPerMonth({ next }: any) {
  const { setValue, watch } = useFormContext()
  const current = watch("shipments_per_month")

  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-gray-900">
        How many shipments do you make per month?
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {options.map((item) => (
          <WizardOptionCard
            key={item.value}
            label={item.label}
            sublabel="shipments"
            selected={current === item.value}
            icon={item.icon}
            style={{ width: cardWidth }}
            onPress={() => {
              setValue("shipments_per_month", item.value)
              next()
            }}
          />
        ))}
      </View>
    </View>
  )
}
