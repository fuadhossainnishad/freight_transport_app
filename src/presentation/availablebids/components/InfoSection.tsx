import { Text, View } from "react-native";

const InfoSection = ({ title, children }: any) => {
    return (
        <View
            className="mb-6">
            <Text className="text-lg font-semibold mb-3">
                {title}
            </Text>

            <View className="bg-gray-50 rounded-2xl border border-black/10">
                {children}
            </View>
        </View>
    );
};

export default InfoSection