import { Text, TextInput, View } from "react-native";

/* REUSABLE INPUT FIELD */
export const Input = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (t: string) => void;
}) => (
  <View className="mb-4">
    <Text className="text-base font-semibold mb-1">{label}</Text>
    <TextInput
      className="border border-gray-300 rounded-lg p-3 text-base"
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
    />
  </View>
);
