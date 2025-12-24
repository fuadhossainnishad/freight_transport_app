import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AppHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <View className="bg-white flex-row items-center px-6 py-4  border-b border-b-[#D8D9E0]">
      {onBack && (
        <TouchableOpacity onPress={onBack} className="">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      )}

      <Text className="flex-1 text-center text-2xl font-medium text-black">
        {title}
      </Text>

      {onBack && <View className="w-10" />}
    </View>
  );
}
