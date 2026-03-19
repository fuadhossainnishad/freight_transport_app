import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Map from "../../../../assets/icons/map.svg";
import ViewIcon from "../../../../assets/icons/view2.svg";
import { Shipment } from "../../../domain/entities/shipment.entity";

interface Props {
    shipment: Shipment;
    onViewPress: (shipment: Shipment) => void;
    onMapPress: (shipment: Shipment) => void;
}

const ShipmentItem: React.FC<Props> = ({ shipment, onViewPress, onMapPress }) => {
    return (
        <View className="flex-row border-t border-gray-200 bg-white">

            {/* Shipment Title */}
            <View className="flex-1 p-3 border-r border-gray-200 justify-center">
                <Text className="text-gray-800 font-medium">{shipment.title}</Text>
            </View>

            {/* Status */}
            <View className="w-28 p-3 border-r border-gray-200 items-center justify-center">
                <Text
                    className={`px-2 py-1 rounded text-black text-xs ${shipment.status === 'IN_PROGRESS' ? "bg-orange-500" : "bg-green-500"
                        }`}
                >
                    {shipment.status === 'IN_PROGRESS' ? "In Progress" : "Delivered"}
                </Text>
            </View>

            {/* Actions */}
            <View className="w-28 flex-row items-center justify-center space-x-3">
                <TouchableOpacity
                    className="bg-[#9900FF]/10 p-2 rounded-full"
                    onPress={() => onViewPress(shipment)}
                >
                    <ViewIcon width={16} height={16} />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#FF0000]/10 p-2 rounded-full"
                    onPress={() => onMapPress(shipment)}
                >
                    <Map width={16} height={16} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ShipmentItem;