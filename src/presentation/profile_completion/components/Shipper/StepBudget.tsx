import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  "Less than 2,500",
  "2,500-10,000",
  "10,000-50,000",
  "More than 50,000"
]

export default function StepBudget({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>Monthly budget for shipments?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setValue("monthly_budget_for_shipment", item)
            next()
          }}
        >
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}

      <Text onPress={back}>Back</Text>

    </View>
  )
}