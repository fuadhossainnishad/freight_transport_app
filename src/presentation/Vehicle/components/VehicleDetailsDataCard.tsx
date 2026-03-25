import React from 'react';
import { View, Text } from 'react-native';

export interface VehicleDetailsDataCardProps {
  label: string;
  data: string;
  fullWidth?: boolean; // optional prop for last item
}

export default function VehicleDetailsDataCard({
  label,
  data,
  fullWidth = false,
}: VehicleDetailsDataCardProps) {
  return (
    <View
      className={`${fullWidth ? "w-full" : "w-[48%]"
        } border border-gray-200 rounded-xl p-4 bg-white`}
    >
      <Text className="text-gray-500 text-sm mb-1">{label}</Text>
      <Text className="text-black text-base font-medium">{data}</Text>
    </View>
  );
}