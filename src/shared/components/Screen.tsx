import React from 'react';
import { View, StyleProp, ViewStyle, ViewProps } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';

type ScreenProps = {
  children: React.ReactNode;
  safeArea?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
} & ViewProps &
  SafeAreaViewProps;

export default function Screen({
  children,
  safeArea = true,
  className = '',
  style,
  ...props
}: ScreenProps) {
  return safeArea ? (
    <SafeAreaView className={className} style={style} {...props}>
      {children}
    </SafeAreaView>
  ) : (
    <View className={className} style={style} {...props}>
      {children}
    </View>
  );
}
