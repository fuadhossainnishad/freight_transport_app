import { SafeAreaView } from "react-native-safe-area-context";
import { LocationGate } from "../components/LocationGate";
import { Text } from "react-native";

// DriverHomeScreen.tsx
export default function DriverHomeScreen() {
  return (
    <LocationGate>
      <DriverHomeContent />
    </LocationGate>
  );
}

function DriverHomeContent() {
  // all your driver screen logic here
  // this only renders when location is granted
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Text>driver home</Text>
    </SafeAreaView>
  );
}