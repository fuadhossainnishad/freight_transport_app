import { TouchableOpacity, Text, View } from "react-native";
import React from "react";
import Arrow from '../../../../assets/icons/arrow2.svg'
import { SvgProps } from "react-native-svg";

interface Props {
    title: string;
    onPress: () => void;
    Icon: React.FC<SvgProps>;

}

export default function SettingsItem({ title, onPress, Icon }: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row justify-between items-center p-4 mt-4 rounded-lg bg-white"
        >
            <View className="flex-row gap-4 items-center">
                <View className="bg-[#F4F4F4] p-2 rounded-full">
                    <Icon height={24} width={24} />
                </View>
                <Text className="text-base text-gray-800">{title}</Text>
            </View>
            <Arrow height={20} width={20} />
        </TouchableOpacity>
    );
}