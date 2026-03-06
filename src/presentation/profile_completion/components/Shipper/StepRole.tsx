import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  "Logistic Manager",
  "Purchasing Manager",
  "Operations Manager",
  "Buyer",
  "Freight Forwarder",
  "Secretariat",
  "Other"
]

export default function StepRole({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>What role fits you?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setValue("shipper_type", item)
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