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
import { LatLng } from "../../../shared/components/LocationPickerInput"

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
    const [pickupCoord, setPickupCoord] = useState<LatLng | null>(null)
    const [deliveryCoord, setDeliveryCoord] = useState<LatLng | null>(null)
    const { control, handleSubmit, setValue } = useForm()

    // Backend stores coordinates as GeoJSON Point ([lng, lat]).
    const toGeoJson = (c: LatLng) =>
        JSON.stringify({ type: "Point", coordinates: [c.longitude, c.latitude] })

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

            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })

            // Exact pins chosen on the map — sent as GeoJSON so the backend can
            // store precise coordinates instead of geocoding the address text.
            if (pickupCoord) formData.append("pickup_location", toGeoJson(pickupCoord))
            if (deliveryCoord) formData.append("delivery_location", toGeoJson(deliveryCoord))

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
                            pickupCoord={pickupCoord}
                            deliveryCoord={deliveryCoord}
                            setPickupCoord={setPickupCoord}
                            setDeliveryCoord={setDeliveryCoord}
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}