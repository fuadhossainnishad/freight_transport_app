import React, { useState } from "react"
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useForm } from "react-hook-form"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Asset } from "react-native-image-picker"
import { ChevronLeft, ChevronRight, Check } from "lucide-react-native"

import AppHeader from "../../../shared/components/AppHeader"
import BasicShipmentInfo from "../components/BasicShipmentInfo"
import DeliveryDetails from "../components/DeliveryDetails"
import SuccessModal from "../../../shared/components/SuccessModal"
import { LatLng } from "../../../shared/components/LocationPickerInput"

import { createShipment } from "../../../data/services/shipmentService"
import { pickShipmentImages } from "../../../shared/hooks/useImagePicker"
import { useAuth } from "../../../app/context/Auth.context"
import { ShipperHomeStackParamList } from "../../../navigation/types"

type NavigationProp = NativeStackNavigationProp<ShipperHomeStackParamList, "CreateShipment">
type RoutePropType = RouteProp<ShipperHomeStackParamList, "CreateShipment">

// Values as actually held by the form. Addresses are stored as plain strings
// (the picker reports the resolved address text); coordinates are tracked
// separately in screen state and sent as flat lat/lng fields.
type ShipmentFormState = {
    shipment_title?: string
    category?: string
    discription?: string
    weight?: string
    type_of_packaging?: string
    dimensions?: string
    pickup_address?: string
    delivery_address?: string
    time_window?: string
    contact_person?: string
    date_preference?: string
    insurance: boolean
    forwarding: boolean
}

const STEPS = ["Shipment Details", "Location & Delivery"]
const BLUE = "#036BB4"

// Numbered step header: circles connected by a progress line, with labels
// centered beneath each circle.
function StepHeader({ step }: { step: number }) {
    return (
        <View className="px-6 pt-1 pb-5">
            {/* Circles + connector */}
            <View className="flex-row items-center">
                {STEPS.map((label, i) => {
                    const active = i === step
                    const done = i < step
                    const reached = active || done
                    return (
                        <React.Fragment key={label}>
                            <View
                                className={`w-9 h-9 rounded-full items-center justify-center ${
                                    reached ? "bg-[#036BB4]" : "bg-white border-2 border-gray-200"
                                }`}
                                style={
                                    active
                                        ? {
                                              shadowColor: "#036BB4",
                                              shadowOpacity: 0.35,
                                              shadowRadius: 8,
                                              shadowOffset: { width: 0, height: 3 },
                                              elevation: 5,
                                          }
                                        : undefined
                                }
                            >
                                {done ? (
                                    <Check size={17} color="#fff" strokeWidth={3} />
                                ) : (
                                    <Text className={`text-sm font-bold ${active ? "text-white" : "text-gray-400"}`}>
                                        {i + 1}
                                    </Text>
                                )}
                            </View>
                            {i < STEPS.length - 1 && (
                                <View className={`flex-1 h-1 mx-2.5 rounded-full ${done ? "bg-[#036BB4]" : "bg-gray-200"}`} />
                            )}
                        </React.Fragment>
                    )
                })}
            </View>

            {/* Labels aligned under their circles */}
            <View className="flex-row justify-between mt-2.5">
                {STEPS.map((label, i) => {
                    const reached = i <= step
                    return (
                        <Text
                            key={label}
                            className={`text-[13px] ${
                                i === step
                                    ? "text-[#036BB4] font-bold"
                                    : reached
                                    ? "text-[#036BB4] font-medium"
                                    : "text-gray-400 font-medium"
                            }`}
                        >
                            {label}
                        </Text>
                    )
                })}
            </View>
        </View>
    )
}

export default function CreateShipmentScreen() {
    const navigation = useNavigation<NavigationProp>()
    const route = useRoute<RoutePropType>()
    const insets = useSafeAreaInsets()
    const { user } = useAuth()

    const [step, setStep] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [images, setImages] = useState<Asset[]>([])
    const [pickupCoord, setPickupCoord] = useState<LatLng | null>(null)
    const [deliveryCoord, setDeliveryCoord] = useState<LatLng | null>(null)

    const { control, handleSubmit, setValue, watch } = useForm<ShipmentFormState>({
        defaultValues: {
            insurance: false,
            forwarding: false,
        },
    })

    const values = watch()

    // Step 1 required fields — gate the "Next" button until they're filled.
    const basicComplete = Boolean(
        values.shipment_title?.trim() &&
        values.category &&
        values.discription?.trim() &&
        values.weight?.trim() &&
        values.type_of_packaging
    )

    const handlePickImages = async () => {
        const selected = await pickShipmentImages()
        if (selected.length > 0) {
            setImages(prev => [...prev, ...selected])
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    // ------------------------------------------------------------------
    // Submit
    // ------------------------------------------------------------------
    const onSubmit = async (data: ShipmentFormState) => {
        if (!values.pickup_address || !values.delivery_address || !values.time_window || !values.contact_person || !values.date_preference) {
            Alert.alert("Missing details", "Please fill in all the delivery details before publishing.")
            return
        }

        try {
            setSubmitting(true)

            const formData = new FormData()
            formData.append("shipper_id", user?.shipper_id as string)

            // multipart delivers every field as a string — skip empties and
            // stringify booleans so the request stays multipart-safe.
            Object.entries(data).forEach(([key, value]) => {
                if (value === undefined || value === null || value === "") return
                formData.append(key, typeof value === "boolean" ? String(value) : (value as any))
            })

            // Send the EXACT picked pin as flat numeric fields. The backend parses
            // them into a GeoJSON Point and stores the precise pin, falling back to
            // geocoding the address only when no pin was dropped.
            if (pickupCoord) {
                formData.append("pickup_lat", String(pickupCoord.latitude))
                formData.append("pickup_lng", String(pickupCoord.longitude))
            }
            if (deliveryCoord) {
                formData.append("delivery_lat", String(deliveryCoord.latitude))
                formData.append("delivery_lng", String(deliveryCoord.longitude))
            }

            images.forEach((img, index) => {
                formData.append("shipment_images", {
                    uri: img.uri,
                    type: img.type,
                    name: img.fileName ?? `image-${index}.jpg`,
                } as any)
            })

            await createShipment(formData)
            setShowSuccess(true)
        } catch {
            Alert.alert("Error", "Shipment creation failed. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
            <AppHeader text="Create Shipment" onpress={() => navigation.goBack()} />
            <StepHeader step={step} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                >
                    {step === 0 && (
                        <BasicShipmentInfo
                            control={control}
                            setValue={setValue}
                            onPickImages={handlePickImages}
                            images={images}
                            onRemoveImage={removeImage}
                        />
                    )}
                    {step === 1 && (
                        <DeliveryDetails
                            control={control}
                            pickupCoord={pickupCoord}
                            deliveryCoord={deliveryCoord}
                            setPickupCoord={setPickupCoord}
                            setDeliveryCoord={setDeliveryCoord}
                        />
                    )}
                </ScrollView>

                {/* Pinned footer — sits above the bottom safe area / tab bar so the
                    primary action is never hidden behind it. */}
                <View
                    style={{
                        flexDirection: "row",
                        gap: 12,
                        paddingHorizontal: 20,
                        paddingTop: 10,
                        paddingBottom: insets.bottom + 10,
                        borderTopWidth: 1,
                        borderTopColor: "#F1F5F9",
                        backgroundColor: "#fff",
                    }}
                >
                    {step === 1 && (
                        <TouchableOpacity
                            onPress={() => setStep(0)}
                            disabled={submitting}
                            activeOpacity={0.7}
                            style={{ flex: 1 }}
                            className="flex-row items-center justify-center gap-1.5 py-3.5 rounded-full border border-gray-300"
                        >
                            <ChevronLeft size={18} color="#374151" />
                            <Text className="text-gray-700 font-semibold text-base">Back</Text>
                        </TouchableOpacity>
                    )}

                    {step === 0 ? (
                        <TouchableOpacity
                            onPress={() => setStep(1)}
                            disabled={!basicComplete}
                            activeOpacity={0.85}
                            style={{ flex: 1, opacity: basicComplete ? 1 : 0.5 }}
                            className="flex-row items-center justify-center gap-1.5 py-3.5 rounded-full bg-[#036BB4]"
                        >
                            <Text className="text-white font-semibold text-base">Next</Text>
                            <ChevronRight size={18} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={submitting}
                            activeOpacity={0.85}
                            style={{ flex: 1, opacity: submitting ? 0.6 : 1 }}
                            className="flex-row items-center justify-center py-3.5 rounded-full bg-[#036BB4]"
                        >
                            <Text className="text-white font-semibold text-base">
                                {submitting ? "Publishing…" : "Publish Shipment"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>

            <SuccessModal
                visible={showSuccess}
                title="Shipment created!"
                message="Your shipment has been created. An admin will manually review it, and once approved it will be available for bidding."
                buttonText="Done"
                onClose={() => {
                    setShowSuccess(false)
                    navigation.goBack()
                }}
            />
        </SafeAreaView>
    )
}
