import { ClearanceValues } from "../types/clearance";
import { LidarClearanceReading } from "../types/lidar";

function distanceToInputValue(value: number | null) {
  if (value === null) return "";

  return String(Math.round(value));
}

export function lidarReadingToClearanceValues(
  reading: LidarClearanceReading,
): ClearanceValues {
  return {
    left: distanceToInputValue(reading.left),
    right: distanceToInputValue(reading.right),
    rear: distanceToInputValue(reading.rear),
    roof: distanceToInputValue(reading.roof),
  };
}
