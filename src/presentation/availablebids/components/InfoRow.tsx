import { Text, View } from "react-native";

const InfoRow = ({ label, value }: any) => {
    return (
        <View className="p-4  flex-1 gap-2 last:border-r-0">
            <Text className="text-gray-500">{label}</Text>
            <Text className="font-medium text-sm">
                {value}
            </Text>
        </View>
    );
};

export default InfoRow