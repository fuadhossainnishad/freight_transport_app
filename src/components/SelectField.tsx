import React from 'react';
import { View, TouchableOpacity } from 'react-native';

export interface ISelectField<T> {
    data: T[]
    value: T
    onSelect: (val: T) => void
    container?: Record<string, any>
    optiondiv?: Record<string, any>
    renderOption: (option: T, selected: boolean) => React.ReactNode
}

export default function SelectField<T>({ data, value, onSelect, container, optiondiv, renderOption }: ISelectField<T>) {
    return (
        <View {...container}>
            {data.map((option: T, ind: number) => (
                <TouchableOpacity key={ind} {...optiondiv} onPress={() => onSelect(option)}>
                    {renderOption(option, value === option)}
                </TouchableOpacity>
            ))}
        </View>
    );
};

