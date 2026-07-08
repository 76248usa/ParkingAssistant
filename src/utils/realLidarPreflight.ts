import { Platform } from "react-native";

export type RealLidarPreflightStatus =
  | "ready-for-native-check"
  | "needs-camera-permission"
  | "camera-denied"
  | "camera-module-missing"
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

async function getDeviceInfo() {
  try {
    const Device = await import("expo-device");

    return {
      deviceName: Device.modelName ?? null,
      isDevice: Boolean(Device.isDevice),
    };
  } catch {
    return {
      deviceName: null,
      isDevice: Platform.OS === "ios",
    };
  }
}

async function getCameraModule() {
  try {
    const CameraModule = await import("expo-camera");

    const moduleAny = CameraModule as any;

    const cameraApi = moduleAny.Camera ?? moduleAny.CameraView ?? moduleAny;

    const getCameraPermissionsAsync =
      cameraApi.getCameraPermissionsAsync ??
      moduleAny.getCameraPermissionsAsync;

    const requestCameraPermissionsAsync =
      cameraApi.requestCameraPermissionsAsync ??
      moduleAny.requestCameraPermissionsAsync;

    if (
      typeof getCameraPermissionsAsync !== "function" ||
      typeof requestCameraPermissionsAsync !== "function"
    ) {
      return null;
    }

    return {
      getCameraPermissionsAsync,
      requestCameraPermissionsAsync,
    };
  } catch {
    return null;
  }
}

function makeBaseResult(
  overrides: Partial<RealLidarPreflightResult>,
): RealLidarPreflightResult {
  return {
    status: "unknown",
    platform: getPlatformName(),
    deviceName: null,
    isDevice: false,
    cameraPermission: "unknown",
    canContinueToNativeLidarCheck: false,
    message:
      "Real LiDAR readiness could not be checked. Manual and Test LiDAR modes are still available.",
    ...overrides,
  };
}

export async function checkRealLidarPreflight(): Promise<RealLidarPreflightResult> {
  const platform = getPlatformName();
  const { deviceName, isDevice } = await getDeviceInfo();

  if (platform !== "ios") {
    return makeBaseResult({
      status: "not-ios",
      platform,
      deviceName,
      isDevice,
      message:
        "Real LiDAR Assist is planned for supported iPhone/iPad devices. This device is not running iOS.",
    });
  }

  if (!isDevice) {
    return makeBaseResult({
      status: "simulator",
      platform,
      deviceName,
      isDevice,
      message:
        "The iOS Simulator cannot provide real LiDAR readings. Use a supported physical iPhone or iPad.",
    });
  }

  const cameraModule = await getCameraModule();

  if (!cameraModule) {
    return makeBaseResult({
      status: "camera-module-missing",
      platform,
      deviceName,
      isDevice,
      message:
        "The camera module is not available in this installed build yet. Reinstall the newest iPhone development build, then reopen the app.",
    });
  }

  const permission = await cameraModule.getCameraPermissionsAsync();

  if (permission.status === "granted") {
    return makeBaseResult({
      status: "ready-for-native-check",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "granted",
      canContinueToNativeLidarCheck: true,
      message:
        "Camera permission is ready. The next step is the native iOS ARKit/LiDAR availability check.",
    });
  }

  if (permission.status === "denied") {
    return makeBaseResult({
      status: "camera-denied",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "denied",
      message:
        "Camera permission is denied. Enable camera access in iPhone Settings before using Real LiDAR Assist.",
    });
  }

  return makeBaseResult({
    status: "needs-camera-permission",
    platform,
    deviceName,
    isDevice,
    cameraPermission: "undetermined",
    message:
      "Camera permission is needed before Real LiDAR Assist can check the sensor.",
  });
}

export async function requestRealLidarCameraPermission(): Promise<RealLidarPreflightResult> {
  const platform = getPlatformName();
  const { deviceName, isDevice } = await getDeviceInfo();

  if (platform !== "ios") {
    return makeBaseResult({
      status: "not-ios",
      platform,
      deviceName,
      isDevice,
      message:
        "Real LiDAR Assist is planned for supported iPhone/iPad devices. This device is not running iOS.",
    });
  }

  if (!isDevice) {
    return makeBaseResult({
      status: "simulator",
      platform,
      deviceName,
      isDevice,
      message:
        "The iOS Simulator cannot provide real LiDAR readings. Use a supported physical iPhone or iPad.",
    });
  }

  const cameraModule = await getCameraModule();

  if (!cameraModule) {
    return makeBaseResult({
      status: "camera-module-missing",
      platform,
      deviceName,
      isDevice,
      message:
        "The camera module is not available in this installed build yet. Reinstall the newest iPhone development build, then reopen the app.",
    });
  }

  const permission = await cameraModule.requestCameraPermissionsAsync();

  if (permission.status === "granted") {
    return makeBaseResult({
      status: "ready-for-native-check",
      platform,
      deviceName,
      isDevice,
      cameraPermission: "granted",
      canContinueToNativeLidarCheck: true,
      message:
        "Camera permission is ready. The next step is the native iOS ARKit/LiDAR availability check.",
    });
  }

  return makeBaseResult({
    status: "camera-denied",
    platform,
    deviceName,
    isDevice,
    cameraPermission: "denied",
    message:
      "Camera permission was not granted. Real LiDAR Assist cannot continue until camera access is allowed.",
  });
}
