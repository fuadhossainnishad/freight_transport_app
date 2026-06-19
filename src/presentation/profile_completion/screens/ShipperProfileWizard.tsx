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
import WizardHeader from "../components/WizardHeader"
import SuccessOverlay from "../components/SuccessOverlay"
import { useState } from "react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ShipperRootParamList } from "../../../navigation/types"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { ChevronLeft, ChevronRight } from "lucide-react-native"

import { Text, View, ScrollView, TouchableOpacity } from 'react-native';

type props = NativeStackNavigationProp<ShipperRootParamList, 'ProfileWizard'>;

const TOTAL_STEPS = 8;

// Form field selected at each step — used to know whether the user can move
// forward (e.g. after going back to a step they've already answered).
const STEP_FIELDS = [
  "employee_size",
  "shipments_per_month",
  "monthly_budget_for_shipment",
  "type_of_shipment",
  "shipping_marchandise_at",
  "ship_type",
  "shipper_type",
  "company_address",
];

export default function ShipperProfileWizard() {
  const navigation = useNavigation<props>()
  const insets = useSafeAreaInsets()

  const { form, step, next, back } = useProfileWizard()
  const [showSuccess, setShowSuccess] = useState(false)

  // Reactively read the current step's answer so the Next button can enable
  // once a selection exists (lets users move forward again after going back).
  const values = form.watch()
  const currentAnswered = !!(values as any)?.[STEP_FIELDS[step - 1]]
  const showNext = step < TOTAL_STEPS  // last step has its own "Finish" button

  // Profile saved → play the success animation, then enter the app.
  const handleProfileComplete = () => setShowSuccess(true)

  const goToApp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }]
    })
  }

  return (
    <FormProvider {...form}>
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Title + progress header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 }}>
            Complete your profile
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 18 }}>
            Help us personalize your experience
          </Text>
          <WizardHeader step={step} total={TOTAL_STEPS} />
        </View>

        {/* Step content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
        >
          {step === 1 && <StepCompanySize next={next} />}
          {step === 2 && <StepShipmentPerMonth next={next} back={back} />}
          {step === 3 && <StepBudget next={next} back={back} />}
          {step === 4 && <StepMerchandise next={next} back={back} />}
          {step === 5 && <StepRegion next={next} back={back} />}
          {step === 6 && <StepShipmentType next={next} back={back} />}
          {step === 7 && <StepRole next={next} back={back} />}
          {step === 8 && <StepBasicInfo back={back} onSuccess={handleProfileComplete} />}
        </ScrollView>

        {/* Persistent navigation bar — sits above the bottom safe area */}
        {(step > 1 || showNext) && (
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: insets.bottom + 10,
              borderTopWidth: 1,
              borderTopColor: '#F1F5F9',
              backgroundColor: '#fff',
            }}
          >
            {step > 1 && (
              <TouchableOpacity
                onPress={back}
                activeOpacity={0.7}
                style={{ flex: 1 }}
                className="flex-row items-center justify-center gap-1.5 py-3.5 rounded-full border border-gray-300"
              >
                <ChevronLeft size={18} color="#374151" />
                <Text className="text-gray-700 font-semibold text-base">Back</Text>
              </TouchableOpacity>
            )}

            {showNext && (
              <TouchableOpacity
                onPress={next}
                disabled={!currentAnswered}
                activeOpacity={0.85}
                style={{ flex: 1, opacity: currentAnswered ? 1 : 0.5 }}
                className="flex-row items-center justify-center gap-1.5 py-3.5 rounded-full bg-[#036BB4]"
              >
                <Text className="text-white font-semibold text-base">Next</Text>
                <ChevronRight size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <SuccessOverlay visible={showSuccess} onDone={goToApp} />
      </SafeAreaView>
    </FormProvider >
  )
}
