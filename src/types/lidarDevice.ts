export type LidarDeviceSupportStatus =
  | "unknown"
  | "supported"
  | "not-supported"
  | "permission-needed"
  | "unavailable-in-expo-go";

export type LidarDeviceCapability = {
  status: LidarDeviceSupportStatus;
  deviceName: string | null;
  platform: "ios" | "android" | "unknown";
  requiresDevelopmentBuild: boolean;
  message: string;
};
