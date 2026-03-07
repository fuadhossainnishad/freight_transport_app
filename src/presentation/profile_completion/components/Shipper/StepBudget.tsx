import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import Budget from '../../../../../assets/icons/budget.svg'

const options = [
  { label: "Less than 2,500", value: "lt-2500" },
  { label: "Between 2,500 and 10,000", value: "2500-10000" },
  { label: "Between 10,000 and 50,000", value: "10000-50000" },
  { label: "More than 50,000", value: "gt-50000" }
]
export default function StepBudget({ next, back }: any) {

  const { setValue } = useFormContext()
  const cardWidth = (Dimensions.get("window").width - 48) / 2

  return (
    <View className="gap-4">

      <Text className="font-semibold text-xl">
        Monthly budget for shipments?
      </Text>
      <View className="flex-row flex-wrap justify-between ">

        {options.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => {
              setValue("monthly_budget_for_shipment", item.value)
              next()
            }}
            style={{ width: cardWidth }}

            className="border border-black/10 p-4 flex-col items-center bg-black/10 rounded-lg mb-4"
          >
            <Budget width={35} height={35} />

            <Text className="font-semibold mt-2 text-center text-wrap w-1/3">
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