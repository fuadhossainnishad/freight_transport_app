import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  { label: "Less than 2,500", value: "lt-2500" },
  { label: "2,500 - 10,000", value: "2500-10000" },
  { label: "10,000 - 50,000", value: "10000-50000" },
  { label: "More than 50,000", value: "gt-50000" }
]
export default function StepBudget({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>Monthly budget for shipments?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={() => {
            setValue("monthly_budget_for_shipment", item.value)
            next()
          }}
        >
          <Text>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <Text onPress={back}>Back</Text>

    </View>
  )
}