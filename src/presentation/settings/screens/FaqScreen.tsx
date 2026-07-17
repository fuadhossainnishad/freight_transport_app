import React, { useEffect, useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useFaqs } from "../hooks/useFaqs";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../shared/components/AppHeader";
import { SettingsStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { FAQ } from "../../../domain/entities/faq";
import Faq from "../../../../assets/icons/faq.svg"
import Arrow from "../../../../assets/icons/up_arrow.svg"

type Props = NativeStackNavigationProp<SettingsStackParamList, "Faq">;

export default function FaqScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Props>();

  const { loadFaqs, loading, faqs } = useFaqs();

  // Fallback shown only when the API returns no FAQs. Live FAQ content is
  // authored backend-side and arrives in one language — see CLAUDE.md.
  const defaultFaqs: FAQ[] = useMemo(
    () => [
      { _id: "1", question: t("settings.faq.defaults.q1"), answer: t("settings.faq.defaults.a1") },
      { _id: "2", question: t("settings.faq.defaults.q2"), answer: t("settings.faq.defaults.a2") },
      { _id: "3", question: t("settings.faq.defaults.q3"), answer: t("settings.faq.defaults.a3") },
    ],
    [t],
  );

  const [openId, setOpenId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      await loadFaqs();
    } catch (err) {
      console.log("FAQ fetch error:", err);
    }
  }, [loadFaqs]);

  useEffect(() => {
    fetchData();
  }, []);

  // fallback data if API empty
  const faqList = useMemo(() => {
    if (!faqs || faqs.length === 0) return defaultFaqs;
    return faqs;
  }, [faqs, defaultFaqs]);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (loading && faqList.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      <AppHeader text={t("settings.faq.title")} onpress={() => navigation.goBack()} />

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={faqList}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
        renderItem={({ item }) => {
          const isOpen = openId === item._id;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleFaq(item._id)}
              className="mb-4 border border-gray-200 rounded-lg p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Faq height={20} width={20} />
                  <Text className="text-[#3C3D3F] text-lg font-medium">
                    {item.question}</Text>
                </View>
                <View
                  className=" bg-black rounded-full"
                  style={{
                    transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                  }}>
                  <Arrow height={20} width={20} />
                </View>
              </View>

              {isOpen && (
                <Text className="text-gray-600 mt-2">
                  {item.answer}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}