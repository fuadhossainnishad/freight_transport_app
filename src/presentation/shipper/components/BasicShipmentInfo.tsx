/**
 * BasicShipmentInfo.tsx
 *
 * Fix: removed the duplicate upload-trigger button.
 * Previously both an "Upload Images" zone (shown when empty) AND a
 * standalone Add button (always shown) were rendered simultaneously,
 * which confused the UI. Now:
 *   - Empty state: shows a full dashed upload zone.
 *   - Has images: shows the image grid + a small "Add more" button below.
 */

import React, { useState } from "react"
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
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
        <View style={styles.container}>

            {/* Shipment title */}
            <Text style={styles.label}>Shipment title</Text>
            <Controller
                control={control}
                name="shipment_title"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Ship 12 Pallets of Rice"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            <SelectField
                label="Category"
                name="category"
                placeholder="Select category"
                control={control}
                onPress={() => setCategoryVisible(true)}
            />

            <Text style={styles.label}>Description</Text>
            <Controller
                control={control}
                name="discription"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        multiline
                        style={[styles.input, styles.multiline]}
                        placeholder="Description"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            <Text style={styles.label}>Weight</Text>
            <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="2300 KG"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="number-pad"
                    />
                )}
            />

            <SelectField
                label="Packaging Type"
                name="type_of_packaging"
                placeholder="Select packaging type"
                control={control}
                onPress={() => setPackagingVisible(true)}
            />

            <Text style={styles.label}>Dimensions</Text>
            <Controller
                control={control}
                name="dimensions"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="120 / 100 / 160 cm"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                    />
                )}
            />

            {/* ── Image upload area ─────────────────────────── */}
            {images.length === 0 ? (
                // Empty state — full upload zone
                <TouchableOpacity
                    onPress={onPickImages}
                    style={styles.uploadZone}
                    activeOpacity={0.7}
                >
                    <Upload height={36} width={36} />
                    <Text style={styles.uploadText}>Tap to upload images</Text>
                    <Text style={styles.uploadSubtext}>JPG, PNG supported</Text>
                </TouchableOpacity>
            ) : (
                // Has images — grid + add more button
                <View style={styles.imageSection}>
                    <View style={styles.imageGrid}>
                        {images.map((img, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => onRemoveImage(index)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.imageWrapper}>
                                    <Image
                                        source={{ uri: img.uri }}
                                        style={styles.thumbnail}
                                    />
                                    {/* Remove badge */}
                                    <View style={styles.removeBadge}>
                                        <Text style={styles.removeBadgeText}>✕</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Add more */}
                    <TouchableOpacity
                        onPress={onPickImages}
                        style={styles.addMoreButton}
                        activeOpacity={0.7}
                    >
                        <Add height={22} width={22} />
                        <Text style={styles.addMoreText}>Add more images</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                onPress={onNext}
                style={styles.nextButton}
                activeOpacity={0.85}
            >
                <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>

            <OptionSelectorModal
                visible={categoryVisible}
                options={CATEGORY_OPTIONS}
                onClose={() => setCategoryVisible(false)}
                onSelect={(value: string) => {
                    setValue("category", value)
                    setCategoryVisible(false)
                }}
            />

            <OptionSelectorModal
                visible={packagingVisible}
                options={PACKAGING_OPTIONS}
                onClose={() => setPackagingVisible(false)}
                onSelect={(value: string) => {
                    setValue("type_of_packaging", value)
                    setPackagingVisible(false)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    label: {
        fontWeight: "600",
        marginBottom: 6,
        color: "#1a1a1a",
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: "#AEAEAE",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 16,
        fontSize: 14,
        color: "#1a1a1a",
        backgroundColor: "#fff",
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: "top",
    },

    // Upload
    uploadZone: {
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#AEAEAE",
        borderRadius: 12,
        paddingVertical: 32,
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
        backgroundColor: "#fafafa",
    },
    uploadText: {
        fontSize: 14,
        color: "#555",
        fontWeight: "500",
    },
    uploadSubtext: {
        fontSize: 12,
        color: "#9ca3af",
    },

    // Image grid
    imageSection: {
        marginBottom: 20,
    },
    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 12,
    },
    imageWrapper: {
        position: "relative",
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    removeBadge: {
        position: "absolute",
        top: -6,
        right: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#ef4444",
        alignItems: "center",
        justifyContent: "center",
    },
    removeBadgeText: {
        color: "#fff",
        fontSize: 9,
        fontWeight: "700",
    },
    addMoreButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#036BB4",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignSelf: "flex-start",
    },
    addMoreText: {
        color: "#036BB4",
        fontSize: 13,
        fontWeight: "500",
    },

    // Next
    nextButton: {
        backgroundColor: "#036BB4",
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 4,
    },
    nextText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
})