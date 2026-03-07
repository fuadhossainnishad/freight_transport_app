import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import Ltl from '../../../../../assets/icons/ltl.svg'
import Ftl from '../../../../../assets/icons/ftl.svg'

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
  const cardWidth = (Dimensions.get("window").width - 48) / 2

  return (
    <View className="gap-4">

      <Text className="font-semibold text-xl">
        You are shipping:</Text>
      <View className="flex-row flex-wrap justify-between ">

        {options.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => {
              setValue("ship_type", item.value)
              next()
            }}
            style={{ width: cardWidth }}

            className="border border-black/10 p-4 flex-col items-center bg-black/10 rounded-lg mb-4"
          >            {item.value === "Partial_Trucks" ? (
            <Ltl width={100} height={100} />
          ) : (
            <Ftl width={100} height={100} />
          )}
            <Text className="font-semibold text-center w-1/3">
              {item.label}</Text>
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