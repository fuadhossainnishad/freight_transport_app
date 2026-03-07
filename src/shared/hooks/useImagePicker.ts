import { launchImageLibrary } from "react-native-image-picker"

export const pickShipmentImages = async () => {
    const res = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 5,
    })

    if (res.assets) {
        return res.assets
    }

    return []
}