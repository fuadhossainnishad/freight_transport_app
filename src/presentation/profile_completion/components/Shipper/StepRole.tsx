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
    <View className="">

      <Text className="font-semibold text-xl mb-4">
        What role fits you?</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={() => {
            setValue("shipper_type", item.value)
            next()
          }}
          className="border border-black/10 p-4 flex-col font-semibold bg-black/10 rounded-lg mb-4"

        >
          <Text>{item.label}</Text>
        </TouchableOpacity>
      ))}

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