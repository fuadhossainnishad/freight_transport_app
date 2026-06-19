import { Text, View, ScrollView, TouchableOpacity, Alert } from "react-native"
import { FormProvider } from "react-hook-form"
import { useState } from "react"

import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { TransporterRootParamList } from "../../../navigation/types"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { ChevronLeft, ChevronRight } from "lucide-react-native"

import StepCompanyAddress from "../components/Transporter/StepCompanyAddress"
import StepDocumentUpload from "../components/Transporter/StepDocumentUpload"
import StepReview from "../components/Transporter/StepReview"
import WizardHeader from "../components/WizardHeader"
import SuccessOverlay from "../components/SuccessOverlay"

import { useUser } from "../../../app/context/User.context"
import { useAuth } from "../../../app/context/Auth.context"
import { CompleteTransporterProfileUseCase } from "../../../domain/usecases/complete-transporter.usecase"
import { useTransporterProfileWizard } from "../hooks/useTransporterProfileWizard"

type NavigationProps = NativeStackNavigationProp<TransporterRootParamList, 'ProfileWizard'>;

const TOTAL_STEPS = 4;

export default function TransporterProfileWizard() {
    const navigation = useNavigation<NavigationProps>()
    const insets = useSafeAreaInsets()

    const { form, step, next, back } = useTransporterProfileWizard()
    const { setUser } = useUser()
    const { user: authUser } = useAuth()

    const [submitting, setSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Reactively read the form so the Next button enables once the current
    // step is answered (mirrors the shipper wizard's per-step gating).
    const values = form.watch()
    const canAdvance = (() => {
        switch (step) {
            case 1: return !!values.company_address?.trim()
            case 2: return !!values.registration_certificate
            case 3: return !!values.transport_license
            default: return true
        }
    })()

    const handleSubmit = async () => {
        const transporterId = authUser?.transporter_id

        // Guard against the bug that produced `_id: "undefined"` on the backend:
        // never POST a missing id (FormData would coerce it to the string "undefined").
        if (!transporterId) {
            Alert.alert("Session error", "We couldn't verify your account. Please sign in again.")
            return
        }

        const { company_address, registration_certificate, transport_license } = values

        if (!company_address?.trim() || !registration_certificate || !transport_license) {
            Alert.alert("Incomplete profile", "Please complete every step before submitting.")
            return
        }

        try {
            setSubmitting(true)

            const formData = new FormData()
            formData.append("transporter_id", transporterId)
            formData.append("company_address", company_address.trim())

            const documents = [
                { key: "registration_certificate", file: registration_certificate },
                { key: "transport_license", file: transport_license },
            ]
            documents.forEach((doc) => {
                formData.append(doc.key, {
                    uri: doc.file.uri,
                    type: doc.file.type || "application/pdf",
                    name: doc.file.name || `${doc.key}.pdf`,
                } as any)
            })

            const res = await CompleteTransporterProfileUseCase.execute(formData)

            if (res?.success) {
                setUser(prev => ({
                    ...prev!,
                    transporterProfile: res.data,
                }))
                setShowSuccess(true)
            } else {
                throw new Error(res?.message || "Submission failed")
            }
        } catch (error: any) {
            console.error("Transporter profile error:", error)
            Alert.alert(
                "Submission Failed",
                error?.response?.data?.message || error?.message || "Unable to complete profile. Please try again."
            )
        } finally {
            setSubmitting(false)
        }
    }

    const goToApp = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }],
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
                        Verify your business to start transporting
                    </Text>
                    <WizardHeader step={step} total={TOTAL_STEPS} />
                </View>

                {/* Step content */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
                >
                    {step === 1 && <StepCompanyAddress />}
                    {step === 2 && (
                        <StepDocumentUpload
                            field="registration_certificate"
                            category="Documentation"
                            title="Upload registration certificate"
                            documentLabel="Company Registration Certificate"
                        />
                    )}
                    {step === 3 && (
                        <StepDocumentUpload
                            field="transport_license"
                            category="Documentation"
                            title="Upload transport license"
                            documentLabel="Transport License"
                        />
                    )}
                    {step === 4 && <StepReview />}
                </ScrollView>

                {/* Persistent navigation bar */}
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
                            disabled={submitting}
                            activeOpacity={0.7}
                            style={{ flex: 1 }}
                            className="flex-row items-center justify-center gap-1.5 py-3.5 rounded-full border border-gray-300"
                        >
                            <ChevronLeft size={18} color="#374151" />
                            <Text className="text-gray-700 font-semibold text-base">Back</Text>
                        </TouchableOpacity>
                    )}

                    {step < TOTAL_STEPS ? (
                        <TouchableOpacity
                            onPress={next}
                            disabled={!canAdvance}
                            activeOpacity={0.85}
                            style={{ flex: 1, opacity: canAdvance ? 1 : 0.5 }}
                            className="flex-row items-center justify-center gap-1.5 py-3.5 rounded-full bg-[#036BB4]"
                        >
                            <Text className="text-white font-semibold text-base">Next</Text>
                            <ChevronRight size={18} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={submitting}
                            activeOpacity={0.85}
                            style={{ flex: 1, opacity: submitting ? 0.6 : 1 }}
                            className="flex-row items-center justify-center gap-1.5 py-3.5 rounded-full bg-[#036BB4]"
                        >
                            <Text className="text-white font-semibold text-base">
                                {submitting ? "Submitting…" : "Submit for review"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <SuccessOverlay
                    visible={showSuccess}
                    title="Profile submitted!"
                    subtitle="You're all set — welcome aboard 🎉"
                    onDone={goToApp}
                />
            </SafeAreaView>
        </FormProvider>
    )
}
