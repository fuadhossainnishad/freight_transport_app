import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  { label: "Logistic Manager", value: "Logistic_Manager" },
  { label: "Purchasing Manager", value: "Purchasing_Manager" },
  { label: "Operations Manager", value: "Operations_Manager" },
  { label: "Buyer", value: "Buyer" },
  { label: "Freight Forwarder", value: "Freight_Forwarder" },
  { label: "Secretariat", value: "Secretariat" },
  { label: "Other", value: "Other" }
]

export default function StepRole({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>What role fits you?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={() => {
            setValue("shipper_type", item.value)
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