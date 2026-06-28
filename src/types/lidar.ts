export type DistanceSource = "manual" | "lidar";

export type LidarClearanceReading = {
  left: number | null;
  right: number | null;
  rear: number | null;
  roof: number | null;
  source: DistanceSource;
  timestamp: number;
};
