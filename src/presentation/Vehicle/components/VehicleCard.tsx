import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import EditIcon from "../../../../assets/icons/edit3.svg"
import ViewIcon from "../../../../assets/icons/view.svg"
import DeleteIcon from "../../../../assets/icons/delete.svg"


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
        <View className="bg-white rounded-lg pb-2 mb-4 shadow gap-1">
            <Image
                source={{ uri: vehicle.images?.[0] }}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
            />

            <Text className="text-sm font-semibold px-2">
                {vehicle.name}
            </Text>

            <Text className="text-sm font-normal px-2">
                Plate: {vehicle.plateNumber}
            </Text>

            <View className="flex-row justify-center gap-2 my-1">
                <TouchableOpacity
                    className="bg-[#9900FF]/10 p-2 rounded-full"
                    onPress={onView}>
                    <ViewIcon height={16} width={16} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#036BB4]/10 p-2 rounded-full"
                    onPress={onEdit}>
                    <EditIcon height={16} width={16} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#FF0000]/10 p-2 rounded-full"
                    onPress={onDelete}>
                    <DeleteIcon height={16} width={16} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VehicleCard;