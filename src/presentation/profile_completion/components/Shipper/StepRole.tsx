import { View, Text } from "react-native"
import { useFormContext } from "react-hook-form"
import WizardOptionCard from "../WizardOptionCard"

const options = [
  { label: "Logistic Manager", value: "Logistic_Manager" },
  { label: "Purchasing Manager", value: "Purchasing_Manager" },
  { label: "Operations Manager", value: "Operations_Manager" },
  { label: "Buyer", value: "Buyer" },
  { label: "Freight Forwarder", value: "Freight_Forwarder" },
  { label: "Secretariat", value: "Secretariat" },
  { label: "Other", value: "Other" }
]

export default function StepRole({ next }: any) {
  const { setValue, watch } = useFormContext()
  const current = watch("shipper_type")

  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-gray-900">
        What role fits you best?
      </Text>

      <View style={{ gap: 12 }}>
        {options.map((item) => (
          <WizardOptionCard
            key={item.value}
            layout="row"
            label={item.label}
            selected={current === item.value}
            onPress={() => {
              setValue("shipper_type", item.value)
              next()
            }}
          />
        ))}
      </View>
    </View>
  )
}
