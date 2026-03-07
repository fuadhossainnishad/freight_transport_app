import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import Truck from '../../../../../assets/icons/transporter.svg'
import Arrow from "../../../../../assets/icons/Arrow_right.svg"
const options = [
  { label: "0 - 5", value: "0-5" },
  { label: "6 - 10", value: "6-10" },
  { label: "11 - 50", value: "11-50" },
  { label: "50 - 200", value: "50-200" },
  { label: "200+", value: "200_plus" }
]

export default function StepShipmentPerMonth({ next, back }: any) {

  const { setValue } = useFormContext()
  const cardWidth = (Dimensions.get("window").width - 48) / 2

  return (
    <View className="gap-4">

      <Text className="font-semibold text-xl">
        How many shipments do you make per month?
      </Text>
      <View className="flex-row flex-wrap justify-between ">

        {options.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => {
              setValue("shipments_per_month", item.value)
              next()
            }}
            style={{ width: cardWidth }}

            className="border border-black/10 p-4 flex-col items-center bg-black/10 rounded-lg mb-4"
          >
            <Truck width={35} height={35} />
            <Text className="font-semibold mt-2 text-center">
              {item.label}
            </Text>

            {/* Employees text BELOW label */}
            <Text className="text-gray-500 text-sm mt-1 text-center">
              shipments
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
