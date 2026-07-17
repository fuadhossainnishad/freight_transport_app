import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";

import AppHeader from "../../../shared/components/AppHeader";
import { Info, InfoType } from "../../../domain/entities/Info.entity";
import { BRAND_NAME } from "../../../domain/constants/brand";
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

// One source of truth for these titles, shared with the settings menu.
const TITLE_KEYS: Record<InfoType, ParseKeys> = {
  about: "settings.menu.about",
  privacy: "settings.menu.privacy",
  terms: "settings.menu.terms",
  hiring: "settings.menu.hiring",
  carrier: "settings.menu.carrierData",
};

const InfoScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<Props>();
  const route = useRoute<InfoScreenRouteProp>();
  const { type } = route.params;
  const title = t(TITLE_KEYS[type], { brand: BRAND_NAME });

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
          <Text className="text-gray-500 text-center">{t("settings.info.empty")}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InfoScreen;