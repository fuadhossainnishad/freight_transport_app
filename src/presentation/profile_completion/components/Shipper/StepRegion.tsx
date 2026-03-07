import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { useFormContext } from "react-hook-form"
import National from '../../../../../assets/icons/national2.svg'
import Regional from '../../../../../assets/icons/national.svg'
import International from '../../../../../assets/icons/international.svg'

const options = [
  "Regional",
  "National",
  "International"
]

export default function StepRegion({ next, back }: any) {

  const { setValue } = useFormContext()
  const cardWidth = (Dimensions.get("window").width - 48) / 2

  return (
    <View className="gap-4">

      <Text className="font-semibold text-xl">
        Where do you ship?</Text>

      <View className="flex-row flex-wrap justify-between ">

        {options.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              setValue("shipping_marchandise_at", item)
              next()
            }}
            style={{ width: cardWidth }}

            className="border border-black/10 p-4 flex-col items-center bg-black/10 rounded-lg mb-4"
          >
            {item === 'National' ? (
              <National width={35} height={35} />
            ) : item === 'Regional' ? (
              <Regional width={35} height={35} />) : (
              <International width={35} height={35} />
            )}
            <Text className="font-semibold mt-2 text-center">
              {item}
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