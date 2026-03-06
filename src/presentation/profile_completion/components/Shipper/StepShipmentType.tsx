import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  "Partial trucks (LTL)",
  "Complete trucks (FTL)"
]

export default function StepShipmentType({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>You are shipping:</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setValue("ship_type", item)
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