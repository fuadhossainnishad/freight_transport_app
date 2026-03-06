import { View, Text, TouchableOpacity } from "react-native"
import { useFormContext } from "react-hook-form"

const options = [
  { label: "1 - 5 employees", value: "1-5" },
  { label: "6 - 20 employees", value: "6-20" },
  { label: "21 - 50 employees", value: "21-50" },
  { label: "51 - 200 employees", value: "51-200" },
  { label: "201 - 200 employees", value: "201-500" },
  { label: "500+ employees", value: "500_Plus" }
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
          key={item.label}
          onPress={() => {
            setValue("employee_size", item.value)
            next()
          }}
          style={{ padding: 15 }}
        >
          <Text>{item.label} employees</Text>
        </TouchableOpacity>
      ))}

    </View>
  )
}