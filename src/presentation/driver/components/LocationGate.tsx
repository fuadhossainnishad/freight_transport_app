// components/LocationGate.tsx
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useLocationPermission from "../hooks/useLocationPermission";
import { LocationPermissionGate } from "./LocationPermissionGate";

type Props = {
  children: React.ReactNode;
};

export function LocationGate({ children }: Props) {
  const { status, request } = useLocationPermission();

  // ── checking — show nothing while OS permission is being checked ──
  if (status === "idle" || status === "checking") {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </SafeAreaView>
    );
  }

  // ── not granted — show permission UI ──
  if (status === "denied" || status === "blocked") {
    return (
      <LocationPermissionGate
        status={status}
        onRequest={request}
      />
    );
  }

  // ── granted — render the actual screen ──
  return <>{children}</>;
}