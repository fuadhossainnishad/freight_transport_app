// hooks/useLocationPermission.ts
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from "react-native-permissions";
import { logger } from "../../../shared/utils/logger";

export type LocationPermissionStatus =
  | "idle"
  | "checking"
  | "granted"
  | "denied"
  | "blocked"; // blocked = user said never ask again

const LOCATION_PERMISSION = Platform.select({
  ios:     PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
})!;

type UseLocationPermissionResult = {
  status: LocationPermissionStatus;
  request: () => Promise<void>;
};

export default function useLocationPermission(): UseLocationPermissionResult {
  const [status, setStatus] = useState<LocationPermissionStatus>("idle");

  // ── check current status on mount — never request without checking first ──
  useEffect(() => {
    const checkPermission = async () => {
      setStatus("checking");

      try {
        const result = await check(LOCATION_PERMISSION);
        setStatus(mapPermissionResult(result));
      } catch (e) {
        logger.error("Location permission check failed:", e);
        setStatus("denied");
      }
    };

    checkPermission();
  }, []);

  // ── only called when user explicitly taps allow ──
  const requestPermission = async () => {
    try {
      const result = await request(LOCATION_PERMISSION);
      setStatus(mapPermissionResult(result));
    } catch (e) {
      logger.error("Location permission request failed:", e);
      setStatus("denied");
    }
  };

  return { status, request: requestPermission };
}

// ── maps OS result → our clean status type ──
function mapPermissionResult(result: PermissionStatus): LocationPermissionStatus {
  switch (result) {
    case RESULTS.GRANTED:     return "granted";
    case RESULTS.DENIED:      return "denied";
    case RESULTS.BLOCKED:     return "blocked";
    case RESULTS.UNAVAILABLE: return "blocked";
    default:                  return "denied";
  }
}