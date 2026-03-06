import { View } from "react-native"
import { FormProvider } from "react-hook-form"
import { useProfileWizard } from "../hooks/useProfileWizard"

import StepDocuments from "../components/Transporter/StepDocuments"
import StepReview from "../components/Transporter/StepReview"
import StepCompanyInfo from "../components/Transporter/StepCompanyInfo"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { TransporterRootParamList } from "../../../navigation/types"
import { useNavigation } from "@react-navigation/native"

type props = NativeStackNavigationProp<TransporterRootParamList, 'ProfileWizard'>;

export default function TransporterProfileWizard() {
    const navigation = useNavigation<props>()
    const { form, step, next, back } = useProfileWizard()
    
    const handleProfileComplete = () => {

        navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }]
        })
    }

    return (
        <FormProvider {...form}>
            <View style={{ flex: 1 }}>

                {step === 1 && <StepCompanyInfo next={next} />}
                {step === 2 && <StepDocuments next={next} back={back} />}
                {step === 3 && <StepReview back={back} onSuccess={handleProfileComplete} />}

            </View>
        </FormProvider>
    )
}