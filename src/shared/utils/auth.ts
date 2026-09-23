import AsyncStorage from "@react-native-async-storage/async-storage"
import { BANK_DETAILS_STORAGE_KEY } from "../storage/bankDetailsStorage"

export const logout = async ():Promise<void>=>{
    try {
        await AsyncStorage.multiRemove([
            'accessToken',
            'refreshToken',
            'user',
            BANK_DETAILS_STORAGE_KEY
        ])
    } catch (error) {
        console.error("Logout storage cleanup failed:",error)
        throw error
    }
}