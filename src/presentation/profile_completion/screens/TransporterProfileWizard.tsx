import { View, Text, Alert } from "react-native"
import { FormProvider } from "react-hook-form"
import { useState } from "react"

import StepDocuments from "../components/Transporter/StepDocuments"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { TransporterRootParamList } from "../../../navigation/types"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import Logo from "../../../../assets/icons/logo.svg"
import { useUser } from "../../../app/context/User.context"
import { CompleteTransporterProfileUseCase } from "../../../domain/usecases/complete-transporter.usecase"
import { useTransporterProfileWizard } from "../hooks/useTransporterProfileWizard"

type NavigationProps = NativeStackNavigationProp<TransporterRootParamList, 'ProfileWizard'>;

export default function TransporterProfileWizard() {
    const navigation = useNavigation<NavigationProps>()
    const { form } = useTransporterProfileWizard()
    const { setUser, user } = useUser()
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        const values = form.getValues()

        const documents = [
            { key: "registration_certificate", file: values.registration_certificate },
            { key: "transport_license", file: values.transport_license },
            { key: "insurance_certificate", file: values.insurance_certificate }
        ]

        // Validate all documents are uploaded
        if (!documents.every(doc => doc.file)) {
            Alert.alert("Error", "Please upload all required documents")
            return
        }

        try {
            setSubmitting(true)

            const formData = new FormData()

            // Append documents
            documents.forEach((doc) => {
                if (doc.file?.uri) {
                    formData.append(doc.key, {
                        uri: doc.file.uri,
                        type: doc.file.type || "application/pdf",
                        name: doc.file.name || `${doc.key}.pdf`
                    } as any)
                }
            })

            // Append transporter ID
            formData.append("transporter_id", user?.id!)

            const res = await CompleteTransporterProfileUseCase.execute(formData)

            if (res?.success) {
                setUser(prev => ({
                    ...prev!,
                    transporterProfile: res.data
                }))

                Alert.alert(
                    "Success!",
                    "Your profile has been completed successfully.",
                    [{
                        text: "Continue",
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Tabs' }]
                            })
                        }
                    }]
                )
            } else {
                throw new Error(res?.message || "Submission failed")
            }
        } catch (error: any) {
            console.error("Transporter profile error:", error)
            Alert.alert(
                "Submission Failed",
                error?.message || "Unable to complete profile. Please try again."
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <FormProvider {...form}>
            <SafeAreaView
                edges={['top']}
                style={{ flex: 1, backgroundColor: '#fff' }}
            >
                <View className="flex-1 px-5">
                    {/* Header Section */}
                    <View className="items-center pt-4 pb-6 border-b border-gray-100">
                        <Logo height={100} width={100} />
                        <Text className="text-2xl text-[#2D2D2D] text-center font-bold mt-3">
                            Documents Upload
                        </Text>
                        <Text className="text-sm text-gray-500 text-center mt-1">
                            Upload your business documents
                        </Text>
                    </View>

                    {/* Step Content */}
                    <View className="flex-1 mt-6">
                        <StepDocuments
                            onSubmit={handleSubmit}
                            loading={submitting}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </FormProvider>
    )
}