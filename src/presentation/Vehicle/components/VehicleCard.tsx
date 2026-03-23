import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface Props {
    vehicle: any;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const VehicleCard: React.FC<Props> = ({
    vehicle,
    onView,
    onEdit,
    onDelete,
}) => {
    return (
        <View className="bg-white rounded-2xl p-4 mb-4 shadow">
            <Image
                source={{ uri: vehicle.images?.[0] }}
                className="w-full h-40 rounded-xl"
                resizeMode="cover"
            />

            <Text className="text-lg font-semibold mt-3">
                {vehicle.name}
            </Text>

            <Text className="text-gray-500">
                Plate: {vehicle.plateNumber}
            </Text>

            <View className="flex-row justify-between mt-4">
                <TouchableOpacity onPress={onView}>
                    <Text className="text-blue-600">View</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onEdit}>
                    <Text className="text-yellow-600">Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onDelete}>
                    <Text className="text-red-600">Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VehicleCard;