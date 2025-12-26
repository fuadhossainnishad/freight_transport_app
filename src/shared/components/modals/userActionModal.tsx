import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import QuestionIcon from '../../assets/icons/question.svg';
type Props = {
  visible: boolean;
  action: 'sendInvite' | 'edit' | 'activate' | 'deactivate' | 'delete' | null;
  userName?: string;
  onClose: () => void;
  onConfirm: () => void;
};

const UserActionModal: React.FC<Props> = ({
  visible,
  action,
  userName,
  onClose,
  onConfirm,
}) => {
  if (!action) return null;

  const getModalContent = () => {
    switch (action) {
      case 'sendInvite':
        return {
          title: `Send Invite to ${userName}?`,
          description: `An invite email will be sent to ${userName}.`,
          description2: `What would you like to do next?`,

          btnText: 'Send Invite',
          btnColor: '#2563EB',
        };
      case 'edit':
        return {
          title: `Edit ${userName}?`,
          description: `You can edit the user's details.`,
          description2: `What would you like to do next?`,
          btnText: 'Edit',
          btnColor: '#FBBF24',
        };
      case 'activate':
        return {
          title: `Activate this user??`,
          description: `Once Activate, the user can access features based on their role`,
          description2: `What would you like to do next?`,
          btnText: 'Activate',
          btnColor: '#006333', // green
        };
      case 'deactivate':
        return {
          title: `Deactivate this user?`,
          description: `Once Deactivate, this user can’t log in or use the app`,
          description2: `What would you like to do next?`,
          btnText: 'Deactivate',
          btnColor: '#A70204',
        };
      case 'delete':
        return {
          title: `Delete this user?`,
          description: `Once Delete, this user will permanently remove from the system.`,
          description2: `What would you like to do next?`,
          btnText: 'Delete',
          btnColor: '#A70204',
        };
      default:
        return { title: '', description: '', btnText: '', btnColor: '#000' };
    }
  };

  const content = getModalContent();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/15 bg-opacity-50 p-4">
        <View className="bg-white rounded-3xl w-full max-w-md p-6 shadow-lg gap-y-4">
          <View className="flex-row justify-center w-full ">
            <QuestionIcon height={100} width={100} />
          </View>

          <Text className="text-xl font-bold text-center">{content.title}</Text>
          <Text className=" text-center">{content.description}</Text>
          <View className="border-b border-gray-300" />
          <Text className=" text-center">{content.description2}</Text>
          <View className="flex-row justify-between gap-3">
            <TouchableOpacity
              className="py-5 rounded-full border flex-1 items-center"
              onPress={onClose}
              accessibilityHint=""
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-5 rounded-full  flex-1 items-center"
              style={{ backgroundColor: content.btnColor }}
              onPress={onConfirm}
            >
              <Text className="text-white">{content.btnText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserActionModal;
