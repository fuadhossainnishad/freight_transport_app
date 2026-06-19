import { View, Text } from "react-native"
import { useFormContext } from "react-hook-form"
import { MapPin, Flag, Globe } from "lucide-react-native"
import WizardOptionCard from "../WizardOptionCard"

const ICON = "#036BB4"

const options = [
  { label: "Regional", sublabel: "Within your region", icon: <MapPin size={24} color={ICON} /> },
  { label: "National", sublabel: "Across the country", icon: <Flag size={24} color={ICON} /> },
  { label: "International", sublabel: "Across borders", icon: <Globe size={24} color={ICON} /> },
]

export default function StepRegion({ next }: any) {
  const { setValue, watch } = useFormContext()
  const current = watch("shipping_marchandise_at")

  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-gray-900">
        Where do you ship?
      </Text>

      <View style={{ gap: 12 }}>
        {options.map((item) => (
          <WizardOptionCard
            key={item.label}
            layout="row"
            label={item.label}
            sublabel={item.sublabel}
            selected={current === item.label}
            icon={item.icon}
            onPress={() => {
              setValue("shipping_marchandise_at", item.label)
              next()
            }}
          />
        ))}
      </View>
    </View>
  )
}
