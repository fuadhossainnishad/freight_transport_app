import { View } from "react-native"
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
      <View style={{ flex: 1 }}>

        {step === 1 && <StepCompanySize next={next} />}
        {step === 2 && <StepShipmentPerMonth next={next} back={back} />}
        {step === 3 && <StepBudget next={next} back={back} />}
        {step === 4 && <StepMerchandise next={next} back={back} />}
        {step === 5 && <StepRegion next={next} back={back} />}
        {step === 6 && <StepShipmentType next={next} back={back} />}
        {step === 7 && <StepRole next={next} back={back} />}
        {step === 8 && <StepBasicInfo back={back} onSuccess={handleProfileComplete} />}

      </View>
    </FormProvider>
  )
}