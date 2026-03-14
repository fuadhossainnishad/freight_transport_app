import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import AppHeader from "../../../shared/components/AppHeader";
import { Info, InfoType } from "../../../domain/entities/Info.entity";
import { SettingsStackParamList } from "../../../navigation/types";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { getInfo } from "../../../data/services/settingsService";
import { SafeAreaView } from "react-native-safe-area-context";

type InfoScreenRouteProp = RouteProp<SettingsStackParamList, "Info">;

type Props = NativeStackNavigationProp<
  SettingsStackParamList,
  "Info"
>;
const InfoScreen = () => {
  const navigation = useNavigation<Props>();
  const route = useRoute<InfoScreenRouteProp>();
  const { type, title } = route.params;

  const [info, setInfo] = useState<Info | null>(null);
  const [loading, setLoading] = useState<boolean>(false);



  const loadInfo = useCallback(async () => {
    setLoading(true);
    const data = await getInfo(type as InfoType);
    if (data) setInfo(data);
    setLoading(false);
  }, [type]);

  useEffect(() => {
    loadInfo();
  }, [type, loadInfo]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#036BB4" />
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white">
      <AppHeader text={title} onpress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}>
        {info ? (
          <Text className="text-gray-700 text-base leading-7">{info.description}</Text>
        ) : (
          <Text className="text-gray-500 text-center">No information available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InfoScreen;