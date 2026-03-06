import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  "1-5",
  "6-20",
  "21-50",
  "51-200",
  "201-500",
  "500+"
]

export default function StepCompanySize({ next }: any) {

  const { setValue } = useFormContext()

  return (
    <View>

      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        What is the size of the company?
      </Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setValue("employee_size", item)
            next()
          }}
          style={{ padding: 15 }}
        >
          <Text>{item} employees</Text>
        </TouchableOpacity>
      ))}

    </View>
  )
}