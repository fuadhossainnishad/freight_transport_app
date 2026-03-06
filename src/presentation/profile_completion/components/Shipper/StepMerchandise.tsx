import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  "Food commodities",
  "Building Materials",
  "Various goods",
  "Mining",
  "Specialized machines",
  "Others"
]

export default function StepMerchandise({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>What type of merchandise do you ship?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setValue("type_of_shipment", item)
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