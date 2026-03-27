import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Modal, Image, TouchableOpacity } from 'react-native';

export interface PreviewModalProps {
  imageUrl: string
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}

export default function PreviewModal({ imageUrl, show, setShow }: PreviewModalProps) {
  return (
    <Modal
      visible={show}
      transparent
      animationType="fade"
      onRequestClose={() => setShow(false)
      }
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-4">

        <View className="bg-white rounded-2xl p-3 w-full">
          <Text className="text-center font-semibold mb-2">
            Driving License
          </Text>

          <Image
            source={{ uri: imageUrl }}
            className="w-full h-72 rounded-xl"
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={() => setShow(false)}
            className="mt-4 bg-black p-3 rounded-xl"
          >
            <Text className="text-white text-center">Close</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
};
