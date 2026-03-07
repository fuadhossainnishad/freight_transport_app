import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { Controller, Control } from "react-hook-form"
import Upload from '../../../../assets/icons/upload.svg'
import Add from '../../../../assets/icons/create.svg'


type Props = {
    control: Control<any>
    onNext: () => void
    onPickImages: () => void
}

export default function BasicShipmentInfo({
    control,
    onNext,
    onPickImages
}: Props) {
    return (
        <View className="p-4">

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

            <Text className="font-semibold mb-2">Category</Text>

            <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
                        placeholder="Furniture"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            <Text className="font-semibold mb-2">Description</Text>

            <Controller
                control={control}
                name="discription"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
                        multiline
                        placeholder="Description"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

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
                    />
                )}
            />

            <Text className="font-semibold mb-2">Packaging Type</Text>

            <Controller
                control={control}
                name="type_of_packaging"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className="border border-[#AEAEAE] p-3 rounded-lg mb-4"
                        placeholder="Wooden Crates"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

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
                    />
                )}
            />

            <TouchableOpacity
                onPress={onPickImages}
                className=" p-4 rounded-lg mb-6 flex-col items-center gap-3 border border-dashed border-[#C3C3C3]"
            >
                <Upload height={40} width={40} />
                <Text className="text-center">Upload Images</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onPickImages}
                className="border border-dashed border-[#C3C3C3] p-4 rounded-lg mb-6 justify-center flex-row"
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

        </View>
    )
}