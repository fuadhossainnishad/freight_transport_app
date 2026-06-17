import { View, Text, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import Ltl from '../../../../../assets/icons/ltl.svg'
import Ftl from '../../../../../assets/icons/ftl.svg'
import WizardOptionCard from "../WizardOptionCard"

const options = [
  { label: "Partial trucks (LTL)", value: "Partial_Trucks", sublabel: "Less than a full truckload" },
  { label: "Complete trucks (FTL)", value: "Complete_Trucks", sublabel: "A dedicated, full truck" }
]

const cardWidth = (Dimensions.get("window").width - 52) / 2

export default function StepShipmentType({ next }: any) {
  const { setValue, watch } = useFormContext()
  const current = watch("ship_type")

  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-gray-900">
        What are you shipping?
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {options.map((item) => (
          <WizardOptionCard
            key={item.value}
            label={item.label}
            sublabel={item.sublabel}
            selected={current === item.value}
            chip={false}
            icon={
              item.value === "Partial_Trucks"
                ? <Ltl width={84} height={84} />
                : <Ftl width={84} height={84} />
            }
            style={{ width: cardWidth, minHeight: 188 }}
            onPress={() => {
              setValue("ship_type", item.value)
              next()
            }}
          />
        ))}
      </View>
    </View>
  )
}
