import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  "0-5",
  "6-10",
  "11-50",
  "50-200",
  "200+"
]

export default function StepShipmentPerMonth({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>How many shipments do you make per month?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setValue("shipments_per_month", item)
            next()
          }}
        >
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={back}>
        <Text>Back</Text>
      </TouchableOpacity>

    </View>
  )
}