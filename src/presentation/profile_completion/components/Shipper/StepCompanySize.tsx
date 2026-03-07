import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import Employee from '../../../../../assets/icons/employee.svg'

const options = [
  { label: "1 - 5 ", value: "1-5" },
  { label: "6 - 20 ", value: "6-20" },
  { label: "21 - 50 ", value: "21-50" },
  { label: "51 - 200 ", value: "51-200" },
  { label: "201 - 200 ", value: "201-500" },
  { label: "More than 500 ", value: "500_Plus" }
]

export default function StepCompanySize({ next }: any) {

  const { setValue } = useFormContext()
  const cardWidth = (Dimensions.get("window").width - 48) / 2

  return (
    <View className="gap-4">
      <Text className="font-semibold text-xl">
        What is the size of the company?
      </Text>
      <View className="flex-row flex-wrap justify-between ">
        {options.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => {
              setValue("employee_size", item.value)
              next()
            }}
            style={{ width: cardWidth }}

            className="border border-black/10 p-4 flex-col items-center bg-black/10 rounded-lg mb-4"
          >
            <Employee width={35} height={35} />
            <Text className="font-semibold mt-3 text-center">
              {item.label}
            </Text>

            {/* Employees text BELOW label */}
            <Text className="text-gray-500 text-sm mt-1 text-center">
              employees
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View >
  )
}