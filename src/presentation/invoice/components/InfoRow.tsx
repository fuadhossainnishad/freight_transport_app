import { Text, View } from "react-native";

const InfoRow = ({ label, value }: any) => {
    return (
        <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
            <Text className="text-gray-500">{label}</Text>
            <Text className="font-medium text-right flex-1 ml-4">
                {value}
            </Text>
        </View>
    );
};

export default InfoRow