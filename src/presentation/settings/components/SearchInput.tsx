import React from "react";
import { View, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import FilterIcon from "../../../../assets/icons/filter.svg"

interface Props {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
}

export const SearchInput: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const { t } = useTranslation();

  return (
    <View className="mb-4 flex-row  ">
        <View className="px-3 py-2 flex-1 border border-gray-300 rounded-l-lg">
            <TextInput
                placeholder={placeholder || t("components.searchInput.placeholder")}
                value={value}
                onChangeText={onChange}
                className="text-black"
            />

        </View>
        <View className="px-3 py-2 bg-[#036BB4] flex-row rounded-r-lg items-center">
            <FilterIcon height={24} width={24} />
        </View>
    </View>
  );
};