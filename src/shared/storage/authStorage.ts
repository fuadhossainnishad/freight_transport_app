import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveAuth = async (
  accessToken: string,
  refreshToken: string
) => {
  await AsyncStorage.multiSet([
    ["accessToken", accessToken],
    ["refreshToken", refreshToken],
  ])
}

export const getAccessToken = async () => {
  return AsyncStorage.getItem("accessToken")
}