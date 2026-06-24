import React from "react";
import { Text, View } from "react-native";
import { ParkingType } from "../constants/parkingGuidance";
import { SiteObstacle } from "./SiteObstacleSelector";

type Props = {
  parkingType: ParkingType;
  stepIndex: number;
  obstacles: SiteObstacle[];
};

function getGoalMessage(
  parkingType: ParkingType,
  stepIndex: number,
  obstacles: SiteObstacle[],
) {
  if (obstacles.includes("lowBranch")) {
    return "Stop and get out to confirm roof and A/C clearance before moving farther.";
  }

  if (obstacles.length > 0) {
    return "Stop and get out to check clearance around selected obstacles before continuing.";
  }

  if (parkingType === "pull-through") {
    if (stepIndex === 0) {
      return "Before pulling through, get out and check both sides, roof clearance, and the exit path.";
    }

    return "Stop and look if either side feels close while pulling through.";
  }

  if (stepIndex === 0) {
    return "Before backing, get out and confirm the campsite entrance, rear clearance, and roof clearance.";
  }

  if (stepIndex === 1 || stepIndex === 2) {
    return "If the trailer angle or clearance is uncertain, stop and get out before backing farther.";
  }

  if (stepIndex >= 3) {
    return "Before the final few feet, get out and check slides, hookups, rear clearance, and walking space.";
  }

  return "When in doubt, stop, set the brake, and get out to look before moving farther.";
}

export function GetOutAndLookCard({
  parkingType,
  stepIndex,
  obstacles,
}: Props) {
  const goalMessage = getGoalMessage(parkingType, stepIndex, obstacles);

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#fff7ed",
        borderWidth: 1,
        borderColor: "#fed7aa",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: "#c2410c",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        GOAL Safety Reminder
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 14,
          fontWeight: "900",
          color: "#0f172a",
          lineHeight: 20,
        }}
      >
        Get Out And Look
      </Text>

      <Text
        style={{
          marginTop: 5,
          fontSize: 13,
          fontWeight: "800",
          color: "#7c2d12",
          lineHeight: 18,
        }}
      >
        {goalMessage}
      </Text>
    </View>
  );
}
