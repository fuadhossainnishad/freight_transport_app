import Clipboard from "@react-native-clipboard/clipboard";
import { Alert } from "react-native";

/**
 * Universal Copy Function
 * Automatically formats any object into readable text.
 */
export const copyData = (item: any) => {
    let text = "";

    Object.keys(item).forEach((key) => {
        // Convert "phone_number" or "jobName" → "Phone Number" / "Job Name"
        const label = key
            .replace(/_/g, " ")
            .replace(/([A-Z])/g, " $1")
            .replace(/^\w/, (c) => c.toUpperCase());

        text += `${label}: ${item[key]}\n`;
    });

    Clipboard.setString(text.trim());
    Alert.alert("Copied!", "Data copied to clipboard.")
};
