import React, { useState } from "react"
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Control, Controller, UseFormSetValue } from "react-hook-form"
import { Asset } from "react-native-image-picker"

import Upload from "../../../../assets/icons/upload.svg"
import Add from "../../../../assets/icons/create.svg"

import SelectField from "../../../shared/components/SelectField"
import OptionSelectorModal from "../../../shared/components/OptionSelectorModal"

type Props = {
    control: Control<any>
    onNext: () => void
    setValue: UseFormSetValue<any>
    onPickImages: () => void
    images: Asset[]
    onRemoveImage: (index: number) => void
}

const CATEGORY_OPTIONS = [
    "Furniture",
    "Electronics",
    "Food",
    "Clothing",
    "Construction Materials",
]

const PACKAGING_OPTIONS = [
    "Wooden Crates",
    "Pallets",
    "Boxes",
    "Drums",
    "Loose Cargo",
]

export default function BasicShipmentInfo({
    control,
    onNext,
    setValue,
    onPickImages,
    images,
    onRemoveImage,
}: Props) {

    const [categoryVisible, setCategoryVisible] = useState(false)
    const [packagingVisible, setPackagingVisible] = useState(false)

    return (
        <View className="p-4">

            {/* Shipment title */}
            <Text className="font-semibold mb-2">Shipment title</Text>
            <Controller
                control={control}
                name="shipment_title"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
                        placeholder="Ship 12 Pallets of Rice"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            {/* Category selector */}
            <SelectField
                label="Category"
                name="category"
                placeholder="Select category"
                control={control}
                onPress={() => setCategoryVisible(true)}
            />

            {/* Description */}
            <Text className="font-semibold mb-2">Description</Text>
            <Controller
                control={control}
                name="discription"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        multiline
                        className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
                        placeholder="Description"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            {/* Weight */}
            <Text className="font-semibold mb-2">Weight</Text>
            <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
                        placeholder="2300 KG"
                        value={value}
                        onChangeText={onChange}
                        keyboardType='number-pad'
                    />
                )}
            />

            {/* Packaging selector */}
            <SelectField
                label="Packaging Type"
                name="type_of_packaging"
                placeholder="Select packaging type"
                control={control}
                onPress={() => setPackagingVisible(true)}
            />

            {/* Dimensions */}
            <Text className="font-semibold mb-2">Dimensions</Text>
            <Controller
                control={control}
                name="dimensions"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
                        placeholder="120 / 100 / 160"
                        value={value}
                        onChangeText={onChange}
                        keyboardType='numeric'

                    />
                )}
            />

            {/* Image preview */}
            <View className="flex-row flex-wrap gap-3 mb-4">
                {images.map((img, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onRemoveImage(index)}
                    >
                        <Image
                            source={{ uri: img.uri }}
                            style={{ width: 80, height: 80, borderRadius: 8 }}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {images.length === 0 && (
                <TouchableOpacity
                    onPress={onPickImages}
                    className="p-4 rounded-lg mb-6 flex-col items-center gap-3 border border-dashed border-[#C3C3C3]"
                >
                    <Upload height={40} width={40} />
                    <Text>Upload Images</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                onPress={onPickImages}
                className="border border-dashed border-[#C3C3C3] p-4 rounded-lg mb-6 items-center"
            >
                <Add height={40} width={40} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onNext}
                className="bg-[#036BB4] p-4 rounded-full"
            >
                <Text className="text-white text-center font-semibold">
                    Next
                </Text>
            </TouchableOpacity>

            {/* Category modal */}
            <OptionSelectorModal
                visible={categoryVisible}
                options={CATEGORY_OPTIONS}
                onClose={() => setCategoryVisible(false)}
                onSelect={(value) => {
                    setValue("category", value)
                    setCategoryVisible(false)
                }}
            />

            {/* Packaging modal */}
            <OptionSelectorModal
                visible={packagingVisible}
                options={PACKAGING_OPTIONS}
                onClose={() => setPackagingVisible(false)}
                onSelect={(value) => {
                    setValue("type_of_packaging", value)
                    setPackagingVisible(false)
                }}
            />
        </View>
    )
}