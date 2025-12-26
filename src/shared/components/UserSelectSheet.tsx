import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

const USERS = [
  "Emily Davis",
  "Anthony Hall",
  "Brian Walker",
  "Amanda Robinson",
  "Lauren Scott",
];

export default function UserSelectSheet({
  selected,
  setSelected,
  onClose,
}: any) {
  const toggle = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((i: string) => i !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  return (
    <Modal animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-2xl p-6 max-h-[70%]">
          <Text className="text-xl font-semibold mb-3">Select User</Text>

          <ScrollView>
            {USERS.map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => toggle(u)}
                className="py-3 flex-row justify-between border-b"
              >
                <Text className="text-lg">{u}</Text>
                {selected.includes(u) && (
                  <Text className="text-green-600 font-semibold">Selected</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="px-5 py-3 bg-gray-200 rounded-lg"
              onPress={onClose}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-5 py-3 bg-[#B09050] rounded-lg"
              onPress={onClose}
            >
              <Text className="text-black font-medium">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
