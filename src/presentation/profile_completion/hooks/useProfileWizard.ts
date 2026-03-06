import { useForm } from "react-hook-form"
import { useState } from "react"

export const useProfileWizard = () => {

  const form = useForm({
    defaultValues: {}
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