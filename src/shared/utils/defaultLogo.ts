import { Image } from "react-native";

export const getDefaultLogoFile = () => {
  const asset = Image.resolveAssetSource(
    require("../../../assets/images/default-company-logo.jpg")
  );

  return {
    uri: asset.uri,
    name: "default-company-logo.jpg",
    type: "image/jpeg",
  };
};