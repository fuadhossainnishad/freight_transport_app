import { FormProvider } from "react-hook-form"
import { useProfileWizard } from "../hooks/useProfileWizard"
import StepCompanySize from "../components/Shipper/StepCompanySize"
import StepBudget from "../components/Shipper/StepBudget"
import StepMerchandise from "../components/Shipper/StepMerchandise"
import StepRegion from "../components/Shipper/StepRegion"
import StepShipmentType from "../components/Shipper/StepShipmentType"
import StepRole from "../components/Shipper/StepRole"
import StepBasicInfo from "../components/Shipper/StepBasicInfo"
import StepShipmentPerMonth from "../components/Shipper/StepShipmentPerMonth"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ShipperRootParamList } from "../../../navigation/types"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"

import Logo from "../../../../assets/icons/logo.svg"
import { Text, View, ScrollView } from 'react-native';

type props = NativeStackNavigationProp<ShipperRootParamList, 'ProfileWizard'>;

export default function ShipperProfileWizard() {
  const navigation = useNavigation<props>()

  const { form, step, next, back } = useProfileWizard()
  const handleProfileComplete = () => {

    // 🚀 Reset navigation after profile creation
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }]
    })
  }
  return (
    <FormProvider {...form}>
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff', gap: 16, paddingHorizontal: 16 }}>
        <View className="flex-col items-center gap-2 border-b pb-4 border-b-black/10">
          <Logo height={120} width={120} />
          <Text className="text-2xl mx-3 text-[#2D2D2D] text-center font-semibold">Help Us Personalize Your Experience</Text>
        </View>
        <ScrollView>
          {step === 1 && <StepCompanySize next={next} />}
          {step === 2 && <StepShipmentPerMonth next={next} back={back} />}
          {step === 3 && <StepBudget next={next} back={back} />}
          {step === 4 && <StepMerchandise next={next} back={back} />}
          {step === 5 && <StepRegion next={next} back={back} />}
          {step === 6 && <StepShipmentType next={next} back={back} />}
          {step === 7 && <StepRole next={next} back={back} />}
          {step === 8 && <StepBasicInfo back={back} onSuccess={handleProfileComplete} />}
        </ScrollView>
      </SafeAreaView>
    </FormProvider >
  )
}