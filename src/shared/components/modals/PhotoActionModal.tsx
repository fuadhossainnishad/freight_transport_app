// components/PhotoActionModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import PhotoIcon from '../../assets/icons/photo.svg';
import CameraIcon from '../../assets/icons/camera.svg';
import RemoveIcon from '../../assets/icons/delete.svg';
import CancelIcon from '../../assets/icons/cancel.svg';

type PhotoActionModalProps = {
  visible: boolean;
  onClose: () => void;
  onChooseGallery?: () => void;
  onTakePhoto?: () => void;
  onRemovePhoto?: () => void;
};

export default function PhotoActionModal({
  visible,
  onClose,
  onChooseGallery,
  onTakePhoto,
  onRemovePhoto,
}: PhotoActionModalProps) {
  const options = [
    {
      icon: <PhotoIcon width={24} height={24} />,
      text: 'Choose from Gallery',
      action: onChooseGallery,
    },
    {
      icon: <CameraIcon width={24} height={24} />,
      text: 'Take Photo',
      action: onTakePhoto,
    },
    {
      icon: <RemoveIcon width={24} height={24} />,
      text: 'Remove Photo',
      action: onRemovePhoto,
    },
    {
      icon: <CancelIcon width={24} height={24} />,
      text: 'Cancel',
      action: onClose,
      cancel: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-transparent bg-opacity-50">
        <View className="bg-white rounded-t-3xl p-4">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center gap-4 p-4 ${option.cancel ? 'bg-gray-200 rounded-lg' : ''}`}
              onPress={() => option.action?.()}
            >
              {option.icon}
              <Text className="text-black text-base">{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}
