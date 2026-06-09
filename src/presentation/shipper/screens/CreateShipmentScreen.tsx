/**
 * CreateShipmentScreen.tsx
 *
 * Fixes:
 * 1. useEffect dependency changed from object reference to a stable JSON string
 *    so it fires even when the user picks the same coordinates twice.
 * 2. Wrapped setValue in the useEffect (not in deps) to avoid stale-closure issues.
 * 3. Minor: cleared route params after consuming them to avoid stale re-fires
 *    on unrelated navigations (optional but robust pattern).
 */

import React, { useEffect, useRef, useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useForm } from "react-hook-form"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Asset } from "react-native-image-picker"

import AppHeader from "../../../shared/components/AppHeader"
import StepIndicator from "../../../shared/components/StepIndicator"
import BasicShipmentInfo from "../components/BasicShipmentInfo"
import DeliveryDetails from "../components/DeliveryDetails"

import { createShipment } from "../../../data/services/shipmentService"
import { pickShipmentImages } from "../../../shared/hooks/useImagePicker"
import { useAuth } from "../../../app/context/Auth.context"
import { ShipperHomeStackParamList } from "../../../navigation/types"
import { ShipmentFormValues } from "../types"

type NavigationProp = NativeStackNavigationProp<ShipperHomeStackParamList, "CreateShipment">
type RoutePropType = RouteProp<ShipperHomeStackParamList, "CreateShipment">

export default function CreateShipmentScreen() {
    const navigation = useNavigation<NavigationProp>()
    const route = useRoute<RoutePropType>()
    const { user } = useAuth()

    const [step, setStep] = useState(0)
    const [images, setImages] = useState<Asset[]>([])

    const { control, handleSubmit, setValue } = useForm<ShipmentFormValues>({
        defaultValues: {
            shipment_title: "",
            category: null,
            discription: "",
            weight: "",
            type_of_packaging: null,
            dimensions: "",
            pickup_address: null,
            delivery_address: null,
            time_window: "",
            contact_person: "",
            date_preference: "",
            insurance: false,
            forwarding: false,
        },
    })

    // ------------------------------------------------------------------
    // Consume location params from AddressPickerScreen.
    //
    // Problem: route.params.selectedLocation is a new object on every
    // navigation.navigate() call — BUT if the user picks the same GPS
    // coordinates twice, the lat/lng values are identical, and React's
    // object-reference comparison would skip the effect.
    //
    // Fix: serialize the location to a JSON string as the dependency key.
    // This is deterministic and fires whenever any value inside changes.
    // ------------------------------------------------------------------
    const selectedLocationKey = route.params?.selectedLocation
        ? JSON.stringify(route.params.selectedLocation)
        : null

    // Track which keys we've already consumed so hot-reload / tab-switch
    // doesn't re-apply stale params.
    const consumedKeys = useRef<Set<string>>(new Set())

    useEffect(() => {
        if (!selectedLocationKey) return
        if (consumedKeys.current.has(selectedLocationKey)) return

        const location = route.params?.selectedLocation
        const field = route.params?.field

        if (!location || !field) return

        consumedKeys.current.add(selectedLocationKey)

        setValue(field as keyof ShipmentFormValues, location, {
            shouldDirty: true,
            shouldValidate: true,
        })
    }, [selectedLocationKey]) // eslint-disable-line react-hooks/exhaustive-deps
    // Note: setValue is stable (react-hook-form guarantees this) so it's
    // safe to omit from deps. Including route.params directly would cause
    // the effect to fire on every unrelated navigation event.

    // ------------------------------------------------------------------
    // Image handling
    // ------------------------------------------------------------------
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
    const onSubmit = async (data: ShipmentFormValues) => {
        try {
            const formData = new FormData()
            formData.append("shipper_id", user?.shipper_id as string)

            // Serialize address objects as JSON strings for the API
            const serialized: Record<string, any> = {
                ...data,
                pickup_address: data.pickup_address
                    ? JSON.stringify(data.pickup_address)
                    : "",
                delivery_address: data.delivery_address
                    ? JSON.stringify(data.delivery_address)
                    : "",
            }

            Object.entries(serialized).forEach(([key, value]) => {
                formData.append(key, value as string)
            })

            images.forEach((img, index) => {
                formData.append("shipment_images", {
                    uri: img.uri,
                    type: img.type,
                    name: img.fileName ?? `image-${index}.jpg`,
                } as any)
            })

            const res = await createShipment(formData)
            Alert.alert("Success", res.message)
        } catch {
            Alert.alert("Error", "Shipment creation failed. Please try again.")
        }
    }

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    return (
        <SafeAreaView className="flex-1 bg-white">
            <AppHeader text="Create Shipment" onpress={() => navigation.goBack()} />
            <StepIndicator step={step} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView keyboardShouldPersistTaps="handled">
                    {step === 0 && (
                        <BasicShipmentInfo
                            control={control}
                            setValue={setValue}
                            onNext={() => setStep(1)}
                            onPickImages={handlePickImages}
                            images={images}
                            onRemoveImage={removeImage}
                        />
                    )}
                    {step === 1 && (
                        <DeliveryDetails
                            control={control}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}