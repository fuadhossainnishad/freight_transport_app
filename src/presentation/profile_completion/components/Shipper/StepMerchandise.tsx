import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import Box from '../../../../../assets/icons/box.svg'
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
  const cardWidth = (Dimensions.get("window").width - 48) / 2

  return (
    <View className="gap-4">

      <Text className="font-semibold text-xl">
        What type of merchandise do you ship?</Text>
      <View className="flex-row flex-wrap justify-between ">

        {options.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => {
              setValue("type_of_shipment", item.value)
              next()
            }}
            style={{ width: cardWidth }}

            className="border border-black/10 p-4 flex-col items-center bg-black/10 rounded-lg mb-4"
          >
            <Box width={35} height={35} />
            <Text className="font-semibold mt-2 text-center">
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="bg-[#036BB4] p-4 rounded-full flex-row items-center justify-center "
        onPress={back}>
        <Text className="text-white text-center font-semibold">
          Back
        </Text>
        {/* <Arrow height={16} width={16} /> */}
      </TouchableOpacity>
    </View>
  )
}