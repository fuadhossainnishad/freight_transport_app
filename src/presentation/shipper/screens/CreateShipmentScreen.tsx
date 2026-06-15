import React, { useState } from "react"
import { ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useForm } from "react-hook-form"

import AppHeader from "../../../shared/components/AppHeader"
import StepIndicator from "../../../shared/components/StepIndicator"
import BasicShipmentInfo from "../components/BasicShipmentInfo"
import DeliveryDetails from "../components/DeliveryDetails"
import { LatLng } from "../../../shared/components/LocationPickerInput"

import { createShipment } from "../../../data/services/shipmentService"
import { pickShipmentImages } from "../../../shared/hooks/useImagePicker"
import { useAuth } from "../../../app/context/Auth.context"
import { ShipperHomeStackParamList } from "../../../navigation/types"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"
import { Asset } from "react-native-image-picker"

type props = NativeStackNavigationProp<ShipperHomeStackParamList, 'Home'>;

export default function CreateShipmentScreen() {

    const navigation = useNavigation<props>()

    const { user } = useAuth()

    const [step, setStep] = useState(0)
    const [images, setImages] = useState<Asset[]>([])
    const [pickupCoord, setPickupCoord] = useState<LatLng | null>(null)
    const [deliveryCoord, setDeliveryCoord] = useState<LatLng | null>(null)
    const { control, handleSubmit, setValue } = useForm()

    const handlePickImages = async () => {
        const selectedImages = await pickShipmentImages()

        if (selectedImages.length > 0) {
            setImages(prev => [...prev, ...selectedImages])
        }
    }
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const onSubmit = async (data: any) => {

        try {

            const formData = new FormData()

            formData.append("shipper_id", user?.shipper_id)

            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })

            // Send the EXACT picked pin as flat numeric fields. multipart/form-data
            // delivers every field as a string, so we cannot send a nested GeoJSON
            // object (the backend doesn't JSON.parse form fields, and a stringified
            // Point crashes it). Flat lat/lng strings are multipart-safe; the
            // backend parses them into a GeoJSON Point and stores the precise pin,
            // falling back to geocoding the address only when no pin was dropped.
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
                    name: img.fileName || `image-${index}.jpg`
                } as any)
            })

            const res = await createShipment(formData)
            console.log("CreateShipmentScreen:", res)

            Alert.alert("Success", res.message)

        } catch (err) {

            Alert.alert("Error", "Shipment creation failed")

        }

    }

    return (
        <SafeAreaView className="flex-1 bg-white">

            <AppHeader text="Create Shipment" onpress={() => navigation.goBack()} />

            <StepIndicator step={step} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                >

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