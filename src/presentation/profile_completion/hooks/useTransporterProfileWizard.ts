import { useForm } from "react-hook-form"
import { useState } from "react"

export interface TransporterDocument {
    uri: string
    name: string
    type: string
    size?: number
}

export interface TransporterProfileFormValues {
    company_address?: string
    registration_certificate?: TransporterDocument
    transport_license?: TransporterDocument
}

export const useTransporterProfileWizard = () => {
    const form = useForm<TransporterProfileFormValues>({
        defaultValues: {
            company_address: "",
            registration_certificate: undefined,
            transport_license: undefined,
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
