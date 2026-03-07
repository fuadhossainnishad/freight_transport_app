import { launchImageLibrary, Asset } from "react-native-image-picker"

export const pickShipmentImages = async (): Promise<Asset[]> => {
  try {
    const res = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 5,
      quality: 0.8,
    })

    if (res.didCancel) {
      return []
    }

    if (res.errorCode) {
      console.log("ImagePicker Error: ", res.errorMessage)
      return []
    }

    return res.assets ?? []
  } catch (error) {
    console.log("Picker Error:", error)
    return []
  }
}