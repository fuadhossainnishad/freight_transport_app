import React, { useState } from "react"
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Control, Controller, UseFormSetValue } from "react-hook-form"
import { Asset } from "react-native-image-picker"
import { useTranslation } from "react-i18next"
import { ImagePlus, X } from "lucide-react-native"

import SelectField from "../../../shared/components/SelectField"
import OptionSelectorModal from "../../../shared/components/OptionSelectorModal"
import { useShipmentOptions } from "../../../shared/i18n/useShipmentOptions"

type Props = {
    control: Control<any>
    setValue: UseFormSetValue<any>
    onPickImages: () => void
    images: Asset[]
    onRemoveImage: (index: number) => void
}

const Label = ({ children, required }: { children: string; required?: boolean }) => (
    <Text className="text-sm font-semibold text-gray-700 mb-1.5">
        {children}
        {required && <Text className="text-red-500"> *</Text>}
    </Text>
)

const inputClass = "border border-gray-300 rounded-xl px-4 py-3.5 text-[15px] text-gray-900 mb-4"

export default function BasicShipmentInfo({
    control,
    setValue,
    onPickImages,
    images,
    onRemoveImage,
}: Props) {
    const { t } = useTranslation()
    // The form stores the untranslated API value; these render the label.
    const { categories, packaging, categoryLabel, packagingLabel } = useShipmentOptions()
    const [categoryVisible, setCategoryVisible] = useState(false)
    const [packagingVisible, setPackagingVisible] = useState(false)

    return (
        <View className="px-5">
            <Text className="text-sm text-gray-500 mb-5">{t("shipper.basicInfo.intro")}</Text>

            {/* Shipment title */}
            <Label required>{t("shipper.basicInfo.titleLabel")}</Label>
            <Controller
                control={control}
                name="shipment_title"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className={inputClass}
                        placeholder={t("shipper.basicInfo.titlePlaceholder")}
                        placeholderTextColor="#9ca3af"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            <SelectField
                label={t("shipper.basicInfo.categoryLabel")}
                name="category"
                placeholder={t("shipper.basicInfo.categoryPlaceholder")}
                control={control}
                onPress={() => setCategoryVisible(true)}
                // Form holds "Furniture"; the user must see "Meubles".
                formatValue={categoryLabel}
            />

            <Label required>{t("shipper.basicInfo.descriptionLabel")}</Label>
            <Controller
                control={control}
                name="discription"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        multiline
                        className={`${inputClass} min-h-[90px]`}
                        style={{ textAlignVertical: "top" }}
                        placeholder={t("shipper.basicInfo.descriptionPlaceholder")}
                        placeholderTextColor="#9ca3af"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            {/* Weight + Packaging side by side */}
            <View className="flex-row gap-3">
                <View className="flex-1">
                    <Label required>{t("shipper.basicInfo.weightLabel")}</Label>
                    <Controller
                        control={control}
                        name="weight"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className={inputClass}
                                placeholder="2300 KG"
                                placeholderTextColor="#9ca3af"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>
                <View className="flex-1">
                    <SelectField
                        label={t("shipper.basicInfo.packagingLabel")}
                        name="type_of_packaging"
                        placeholder={t("shipper.basicInfo.packagingPlaceholder")}
                        control={control}
                        onPress={() => setPackagingVisible(true)}
                        formatValue={packagingLabel}
                    />
                </View>
            </View>

            <Label>{t("shipper.basicInfo.dimensionsLabel")}</Label>
            <Controller
                control={control}
                name="dimensions"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className={inputClass}
                        placeholder="120 / 100 / 160 cm"
                        placeholderTextColor="#9ca3af"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            {/* ── Image upload ─────────────────────────── */}
            <Label>{t("shipper.basicInfo.imagesLabel")}</Label>
            {images.length === 0 ? (
                <TouchableOpacity
                    onPress={onPickImages}
                    activeOpacity={0.7}
                    className="border border-dashed border-gray-300 bg-gray-50 rounded-2xl py-8 items-center"
                >
                    <View className="w-12 h-12 rounded-full bg-[#036BB4]/10 items-center justify-center">
                        <ImagePlus size={24} color="#036BB4" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700 mt-3">{t("shipper.basicInfo.tapToUpload")}</Text>
                    <Text className="text-xs text-gray-400 mt-1">{t("shipper.basicInfo.imageFormats")}</Text>
                </TouchableOpacity>
            ) : (
                <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                    {images.map((img, index) => (
                        <View key={index} style={{ width: 80, height: 80 }}>
                            <Image
                                source={{ uri: img.uri }}
                                style={{ width: 80, height: 80, borderRadius: 12 }}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                onPress={() => onRemoveImage(index)}
                                activeOpacity={0.8}
                                style={{
                                    position: "absolute",
                                    top: -6,
                                    right: -6,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: "#ef4444",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <X size={13} color="#fff" strokeWidth={3} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add more tile */}
                    <TouchableOpacity
                        onPress={onPickImages}
                        activeOpacity={0.7}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderStyle: "dashed",
                            borderColor: "#036BB4",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ImagePlus size={22} color="#036BB4" />
                        <Text className="text-[10px] text-[#036BB4] mt-1 font-medium">{t("shipper.basicInfo.add")}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* The modal shows translated labels but hands back the English
                `value` — which is what gets POSTed and stored. Translating the
                stored value would corrupt the API contract. */}
            <OptionSelectorModal
                visible={categoryVisible}
                options={categories}
                onClose={() => setCategoryVisible(false)}
                onSelect={(value: string) => {
                    setValue("category", value)
                    setCategoryVisible(false)
                }}
            />

            <OptionSelectorModal
                visible={packagingVisible}
                options={packaging}
                onClose={() => setPackagingVisible(false)}
                onSelect={(value: string) => {
                    setValue("type_of_packaging", value)
                    setPackagingVisible(false)
                }}
            />
        </View>
    )
}
