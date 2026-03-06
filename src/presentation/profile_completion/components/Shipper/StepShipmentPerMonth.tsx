import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  { label: "0 - 5 shipments", value: "0-5" },
  { label: "6 - 10 shipments", value: "6-10" },
  { label: "11 - 50 shipments", value: "11-50" },
  { label: "50 - 200 shipments", value: "50-200" },
  { label: "200+ shipments", value: "200_plus" }
]

export default function StepShipmentPerMonth({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>How many shipments do you make per month?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={() => {
            setValue("shipments_per_month", item.value)
            next()
          }}
        >
          <Text>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={back}>
        <Text>Back</Text>
      </TouchableOpacity>

    </View>
  )
}