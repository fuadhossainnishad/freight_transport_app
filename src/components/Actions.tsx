import EditIcon from '../assets/icons/edit.svg';
import CompleteIcon from '../assets/icons/complete.svg';
import DeleteIcon from '../assets/icons/delete.svg';
import PdfIcon from '../assets/icons/pdf.svg';
import SendInviteIcon from '../assets/icons/sendInvite.svg'
import DeactivateIcon from '../assets/icons/deactivate.svg'

import { View, Text, TouchableOpacity } from 'react-native';
import React, { JSX, useState } from 'react';

const ActionArray = [
  {
    name: 'Edit',
    icon: <EditIcon height={24} width={24} />,
  },
  {
    name: 'Completed',
    icon: <CompleteIcon height={24} width={24} />,
  },
  {
    name: 'Delete',
    icon: <DeleteIcon height={24} width={24} />,
  },
];

const UsersActionArray = [
  {
    name: 'Send Invite',
    icon: <SendInviteIcon height={24} width={24} />,
  },
  {
    name: 'Edit',
    icon: <EditIcon height={24} width={24} />,
  },
  {
    name: 'Deactivate',
    icon: <DeactivateIcon height={24} width={24} />,
  },
  {
    name: 'Delete',
    icon: <DeleteIcon height={24} width={24} />,
  },
];

const PunchlistActionArray = [
  {
    name: 'Delete',
    icon: <DeleteIcon height={24} width={24} />,
  },
  {
    name: 'Export to PDF',
    icon: <PdfIcon height={24} width={24} />,
  },
];

export interface IAction {
  container?: Record<string, any>
  // actionContainer?: Record<string, any>
}

export function Actions({
  actions,
}: {
  actions: { name: string; icon: JSX.Element }[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View className="p-2 ">
      {actions.map((action, ind) => (
        <TouchableOpacity
          key={ind}
          onPress={() => setSelected(action.name)}
          className={`flex-row gap-3 items-center p-3 px-5 rounded-lg 
                        ${selected === action.name ? 'bg-gray-200' : 'bg-transparent'}
                    `}
        >
          {action.icon}
          <Text className="text-base">{action.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function CommonAction() {
  return (
    <View>
      <Actions actions={ActionArray} />
    </View>
  );
}

export function PunchlistAction() {
  return (
    <View>
      <Actions actions={PunchlistActionArray} />
    </View>
  );
}

export function MailSettingsAction() {
  return (
    <View>
      <Actions
        actions={ActionArray.filter(action => action.name !== 'Completed')}
      />
    </View>
  );
}

export function UsersAction({ container = {}, onActionPress }: { container?: any, onActionPress: (name: string) => void }) {
  return (
    <View {...container}>
      {UsersActionArray.map((action, ind) => (
        <TouchableOpacity
          key={ind}
          className="flex-row gap-3 items-center p-3 px-5 rounded-lg bg-white shadow"
          onPress={() => onActionPress(action.name)}
        >
          {action.icon}
          <Text className="text-base">{action.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
