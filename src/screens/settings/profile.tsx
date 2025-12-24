import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AppHeader from '../../components/AppHeader';

interface Field {
  label: string;
  value: string;
}

interface ProfileProps {
  title: string;
  mode: 'view' | 'edit';
  type: 'user' | 'company';
  fields: Field[];
  onEdit?: () => void;
  onSave?: (data: Field[]) => void;
  onBack?: () => void;
}

export default function ProfileScreen({
  title,
  mode,
  type,
  fields,
  onEdit,
  onSave,
  onBack,
}: ProfileProps) {
  const [formData, setFormData] = useState<Field[]>(fields);

  const updateField = (index: number, value: string) => {
    const updated = [...formData];
    updated[index].value = value;
    setFormData(updated);
  };

  return (
    <View className="flex-1 bg-white">
      <AppHeader title={title} onBack={onBack || (() => {})} />

      <ScrollView className="p-6">
        {/* Fields */}
        {formData.map((field, index) => (
          <View key={index} className="mb-5">
            <Text className="text-gray-500 text-sm mb-1">{field.label}</Text>

            {mode === 'view' ? (
              <Text className="text-lg font-medium text-black">
                {field.value}
              </Text>
            ) : (
              <TextInput
                className="border border-gray-300 p-3 rounded-lg bg-white text-black"
                value={field.value}
                onChangeText={text => updateField(index, text)}
              />
            )}
          </View>
        ))}

        {/* Button */}
        {mode === 'view' ? (
          <TouchableOpacity
            className="bg-[#d11c1c] p-4 rounded-lg mt-6"
            onPress={onEdit}
          >
            <Text className="text-white text-center text-base font-semibold">
              Edit Profile Info
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-green-600 p-4 rounded-lg mt-6"
            onPress={() => onSave && onSave(formData)}
          >
            <Text className="text-white text-center text-base font-semibold">
              Save Changes
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
