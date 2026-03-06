import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  "Regional",
  "National",
  "International"
]

export default function StepRegion({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>Where do you ship?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setValue("shipping_marchandise_at", item)
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