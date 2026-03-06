import { View } from "react-native"
import { FormProvider } from "react-hook-form"
import { useProfileWizard } from "../hooks/useProfileWizard"

import StepDocuments from "../components/transporter/StepDocuments"
import StepReview from "../components/transporter/StepReview"
import StepCompanyInfo from "../components/Transporter/StepCompanyInfo"

export default function TransporterProfileWizard() {

    const { form, step, next, back } = useProfileWizard()

    return (
        <FormProvider {...form}>
            <View style={{ flex: 1 }}>

                {step === 1 && <StepCompanyInfo next={next} />}
                {step === 2 && <StepDocuments next={next} back={back} />}
                {step === 3 && <StepReview back={back} />}

            </View>
        </FormProvider>
    )
}