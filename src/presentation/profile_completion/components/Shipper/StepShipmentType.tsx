import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  {
    label: "Partial trucks (LTL)",
    value: "Partial_Trucks"
  },
  {
    label: "Complete trucks (FTL)",
    value: "Complete_Trucks"
  }
]

export default function StepShipmentType({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>You are shipping:</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={() => {
            setValue("ship_type", item.value)
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