import AsyncStorage from "@react-native-async-storage/async-storage"

export const logout = async ():Promise<void>=>{
    try {
        await AsyncStorage.multiRemove([
            'accessToken',
            'refreshToken',
            'user'
        ])
    } catch (error) {
        console.error("Logout storage cleanup failed:",error)
        throw error
    }
}