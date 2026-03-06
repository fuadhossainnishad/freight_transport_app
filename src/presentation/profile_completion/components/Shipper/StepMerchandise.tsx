import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  { label: "Food commodities", value: "Food_Commodities" },
  { label: "Building Materials", value: "Building_Materials" },
  { label: "Various goods", value: "Various_Goods" },
  { label: "Mining", value: "Mining" },
  { label: "Specialized machines", value: "Specialized_Machines" },
  { label: "Others", value: "Others" }
]

export default function StepMerchandise({ next, back }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text>What type of merchandise do you ship?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={() => {
            setValue("type_of_shipment", item.value)
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