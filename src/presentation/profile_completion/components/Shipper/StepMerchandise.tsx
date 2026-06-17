import { View, Text, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import { Apple, HardHat, Boxes, Pickaxe, Cog, Ellipsis } from "lucide-react-native"
import WizardOptionCard from "../WizardOptionCard"

const ICON = "#036BB4"

const options = [
  { label: "Food commodities", value: "Food_Commodities", icon: <Apple size={26} color={ICON} /> },
  { label: "Building materials", value: "Building_Materials", icon: <HardHat size={26} color={ICON} /> },
  { label: "Various goods", value: "Various_Goods", icon: <Boxes size={26} color={ICON} /> },
  { label: "Mining", value: "Mining", icon: <Pickaxe size={26} color={ICON} /> },
  { label: "Specialized machines", value: "Specialized_Machines", icon: <Cog size={26} color={ICON} /> },
  { label: "Others", value: "Others", icon: <Ellipsis size={26} color={ICON} /> }
]

const cardWidth = (Dimensions.get("window").width - 52) / 2

export default function StepMerchandise({ next }: any) {
  const { setValue, watch } = useFormContext()
  const current = watch("type_of_shipment")

  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-gray-900">
        What type of merchandise do you ship?
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
              setValue("type_of_shipment", item.value)
              next()
            }}
          />
        ))}
      </View>
    </View>
  )
}
