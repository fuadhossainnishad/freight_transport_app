import { useForm } from "react-hook-form"
import { useState } from "react"

export interface TransporterProfileFormValues {
    registration_certificate?: {
        uri: string
        name: string
        type: string
        size?: number
    }
    transport_license?: {
        uri: string
        name: string
        type: string
        size?: number
    }
    // insurance_certificate?: {
    //     uri: string
    //     name: string
    //     type: string
    //     size?: number
    // }
}

export const useTransporterProfileWizard = () => {
    const form = useForm<TransporterProfileFormValues>({
        defaultValues: {
            registration_certificate: undefined,
            transport_license: undefined,
            // insurance_certificate: undefined,
        }
    })

    const [step, setStep] = useState(1)

    const next = () => setStep(prev => prev + 1)
    const back = () => setStep(prev => prev - 1)

    return {
        form,
        step,
        next,
        back
    }
}