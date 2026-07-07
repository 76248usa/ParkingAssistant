import { ClearanceValues } from "../types/clearance";
import { LidarClearanceReading } from "../types/lidar";
import { LidarDeviceCapability } from "../types/lidarDevice";
import { lidarReadingToClearanceValues } from "./lidarToClearanceValues";
export type LidarSensorStatus =
  | "not-supported"
  | "not-connected"
  | "manual-mode"
  | "test-mode"
  | "real-lidar-ready"
  | "reading";

export type LidarBridgeResult = {
  status: LidarSensorStatus;
  reading: LidarClearanceReading | null;
  clearanceValues: ClearanceValues | null;
  message: string;
};

export function createTestLidarBridgeResult(
  reading: LidarClearanceReading,
): LidarBridgeResult {
  return {
    status: "test-mode",
    reading,
    clearanceValues: lidarReadingToClearanceValues(reading),
    message: "Using test LiDAR reading.",
  };
}

export function createManualModeBridgeResult(): LidarBridgeResult {
  return {
    status: "manual-mode",
    reading: null,
    clearanceValues: null,
    message: "Manual distance entry is active.",
  };
}

export function createNotConnectedBridgeResult(): LidarBridgeResult {
  return {
    status: "not-connected",
    reading: null,
    clearanceValues: null,
    message: "Real LiDAR sensor is not connected yet.",
  };
}

export function checkRealLidarSupportPlaceholder(): LidarBridgeResult {
  return {
    status: "not-connected",
    reading: null,
    clearanceValues: null,
    message:
      "Real LiDAR support check is not connected yet. Future iOS/ARKit code will update this status.",
  };
}

export function getLidarDeviceCapabilityPlaceholder(): LidarDeviceCapability {
  return {
    status: "unavailable-in-expo-go",
    deviceName: null,
    platform: "ios",
    requiresDevelopmentBuild: true,
    message:
      "Real LiDAR checking will require a custom iOS development build. Expo Go cannot access the native ARKit/LiDAR layer.",
  };
}
