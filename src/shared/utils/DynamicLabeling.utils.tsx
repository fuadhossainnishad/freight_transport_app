import React from 'react';
import { View, Text } from 'react-native';

interface DynamicLabelingProps {
  job: Record<string, unknown>;
  skipKeys?: string[];
}

export function DynamicLabeling({ job, skipKeys = [] }: DynamicLabelingProps) {
  return (
    <>
      {Object.keys(job).map(key => {
        if (skipKeys.includes(key)) return null;

        const label = key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^\w/, c => c.toUpperCase());

        return (
          <View key={key} className="flex-row items-start gap-1 mt-3">
            <Text className="text-base text-gray-700 font-medium">
              {label}:
            </Text>
            <Text className="text-base font-semibold flex-1">
              {job[key] as string}
            </Text>
          </View>
        );
      })}
    </>
  );
}
