import { requireNativeModule } from "expo-modules-core";

export type NativeLidarAvailabilityStatus =
  | "supported"
  | "not-supported"
  | "native-module-missing"
  | "error";

export type NativeLidarAvailabilityResult = {
  status: NativeLidarAvailabilityStatus;
  deviceName: string | null;
  systemVersion: string | null;
  worldTrackingSupported: boolean;
  sceneDepthSupported: boolean;
  smoothedSceneDepthSupported: boolean;
  sceneReconstructionSupported: boolean;
  lidarLikelySupported: boolean;
  message: string;
};

function fallbackResult(
  status: NativeLidarAvailabilityStatus,
  message: string,
): NativeLidarAvailabilityResult {
  return {
    status,
    deviceName: null,
    systemVersion: null,
    worldTrackingSupported: false,
    sceneDepthSupported: false,
    smoothedSceneDepthSupported: false,
    sceneReconstructionSupported: false,
    lidarLikelySupported: false,
    message,
  };
}

export async function checkNativeLidarAvailability(): Promise<NativeLidarAvailabilityResult> {
  try {
    const rvLidarModule = requireNativeModule("RvLidar") as {
      checkAvailability: () => NativeLidarAvailabilityResult;
    };

    return rvLidarModule.checkAvailability();
  } catch {
    return fallbackResult(
      "native-module-missing",
      "Native LiDAR availability module is not available in this build yet. Rebuild and reinstall the newest iPhone development build.",
    );
  }
}
