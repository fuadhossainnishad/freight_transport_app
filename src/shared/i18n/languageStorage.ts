import AsyncStorage from "@react-native-async-storage/async-storage"

import { SUPPORTED_LANGUAGES, SupportedLanguage } from "./languages"

const LANGUAGE_KEY = "appLanguage"

const isSupported = (value: string | null): value is SupportedLanguage =>
  !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value)

/**
 * Returns the language the user explicitly picked, or null when they have
 * never picked one (in which case the device locale decides).
 */
export const getStoredLanguage = async (): Promise<SupportedLanguage | null> => {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY)
    return isSupported(stored) ? stored : null
  } catch {
    return null
  }
}

export const storeLanguage = async (language: SupportedLanguage) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language)
}

/** Clears the override so the app follows the device locale again. */
export const clearStoredLanguage = async () => {
  await AsyncStorage.removeItem(LANGUAGE_KEY)
}
