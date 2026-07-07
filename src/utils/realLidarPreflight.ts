import { Camera } from "expo-camera";
import * as Device from "expo-device";
import { Platform } from "react-native";

export type RealLidarPreflightStatus =
  | "ready-for-native-check"
  | "needs-camera-permission"
  | "camera-denied"
  | "not-ios"
  | "simulator"
  | "unknown";

export type RealLidarPreflightResult = {
  status: RealLidarPreflightStatus;
  platform: "ios" | "android" | "web" | "unknown";
  deviceName: string | null;
  isDevice: boolean;
  cameraPermission: "granted" | "denied" | "undetermined" | "unknown";
  canContinueToNativeLidarCheck: boolean;
  message: string;
};

function getPlatformName(): "ios" | "android" | "web" | "unknown" {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  if (Platform.OS === "web") return "web";
  return "unknown";
}

export async function checkRealLidarPreflight(): Promise<RealLidarPreflightResult> {
  const platform = getPlatformName();
  const deviceName = Device.modelName ?? null;
  const isDevice = Device.isDevice;

  if (platform !== "ios") {
    return {
      status: "not-ios",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "unknown",
      canContinueToNativeLidarCheck: false,
      message:
        "Real LiDAR Assist is planned for supported iPhone/iPad devices. This device is not running iOS.",
    };
  }

  if (!isDevice) {
    return {
      status: "simulator",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "unknown",
      canContinueToNativeLidarCheck: false,
      message:
        "The iOS Simulator cannot provide real LiDAR readings. Use a supported physical iPhone or iPad.",
    };
  }

  const permission = await Camera.getCameraPermissionsAsync();

  if (permission.status === "granted") {
    return {
      status: "ready-for-native-check",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "granted",
      canContinueToNativeLidarCheck: true,
      message:
        "Camera permission is ready. The next step is the native iOS ARKit/LiDAR availability check.",
    };
  }

  if (permission.status === "denied") {
    return {
      status: "camera-denied",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "denied",
      canContinueToNativeLidarCheck: false,
      message:
        "Camera permission is denied. Enable camera access in iPhone Settings before using Real LiDAR Assist.",
    };
  }

  return {
    status: "needs-camera-permission",
    platform,
    deviceName,
    isDevice,
    cameraPermission: "undetermined",
    canContinueToNativeLidarCheck: false,
    message:
      "Camera permission is needed before Real LiDAR Assist can check the sensor.",
  };
}

export async function requestRealLidarCameraPermission(): Promise<RealLidarPreflightResult> {
  const platform = getPlatformName();
  const deviceName = Device.modelName ?? null;
  const isDevice = Device.isDevice;

  if (platform !== "ios") {
    return {
      status: "not-ios",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "unknown",
      canContinueToNativeLidarCheck: false,
      message:
        "Real LiDAR Assist is planned for supported iPhone/iPad devices. This device is not running iOS.",
    };
  }

  if (!isDevice) {
    return {
      status: "simulator",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "unknown",
      canContinueToNativeLidarCheck: false,
      message:
        "The iOS Simulator cannot provide real LiDAR readings. Use a supported physical iPhone or iPad.",
    };
  }

  const permission = await Camera.requestCameraPermissionsAsync();

  if (permission.status === "granted") {
    return {
      status: "ready-for-native-check",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "granted",
      canContinueToNativeLidarCheck: true,
      message:
        "Camera permission is ready. The next step is the native iOS ARKit/LiDAR availability check.",
    };
  }

  return {
    status: "camera-denied",
    platform,
    deviceName,
    isDevice,
    cameraPermission: "denied",
    canContinueToNativeLidarCheck: false,
    message:
      "Camera permission was not granted. Real LiDAR Assist cannot continue until camera access is allowed.",
  };
}
