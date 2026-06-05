import { Text, View } from "react-native";
import {
  BackingSide,
  getObstacleDistances,
  getOverallRiskLevel,
  Scenario,
} from "../utils/obstacleDistance";
import { SiteObstacle } from "./SiteObstacleSelector";

type Props = {
  stepIndex: number;
  backingSide: BackingSide;
  scenario: Scenario;
  obstacles: SiteObstacle[];
  trailerAngle: number;
};

function getCoachingMessage({
  stepIndex,
  backingSide,
  scenario,
  obstacles,
  trailerAngle,
}: Props) {
  const distances = getObstacleDistances({
    stepIndex,
    backingSide,
    scenario,
    obstacles,
    trailerAngle,
  });

  const riskLevel = getOverallRiskLevel(
    distances,
    trailerAngle,
    scenario,
    stepIndex,
  );
  const closestObstacle = distances.reduce(
    (closest, item) => {
      if (!closest) return item;
      return item.distance < closest.distance ? item : closest;
    },
    null as null | (typeof distances)[number],
  );

  if (riskLevel === "high") {
    if (closestObstacle) {
      return {
        title: "STOP AND CORRECT",
        message: `${closestObstacle.emoji} ${closestObstacle.label} is only ${closestObstacle.distance} ft away. Stop, pull forward if needed, and correct your angle.`,
        backgroundColor: "#dc2626",
        textColor: "white",
      };
    }

    return {
      title: "STOP AND CHECK",
      message:
        "Risk is high. Stop and check your trailer angle before backing farther.",
      backgroundColor: "#dc2626",
      textColor: "white",
    };
  }

  if (riskLevel === "medium") {
    if (closestObstacle) {
      return {
        title: "SLOW DOWN",
        message: `${closestObstacle.emoji} ${closestObstacle.label} clearance is getting tight. Use smaller steering corrections.`,
        backgroundColor: "#f97316",
        textColor: "white",
      };
    }

    return {
      title: "SLOW DOWN",
      message:
        "Continue slowly and correct early. Avoid sharp steering changes.",
      backgroundColor: "#f97316",
      textColor: "white",
    };
  }

  if (stepIndex === 0) {
    return {
      title: "GOOD SETUP",
      message: "Start straight, use your mirrors, and begin backing slowly.",
      backgroundColor: "#16a34a",
      textColor: "white",
    };
  }

  if (stepIndex === 1) {
    return {
      title: "START THE TURN",
      message:
        backingSide === "left"
          ? "Begin a controlled left steering input. Watch the trailer start to angle."
          : "Begin a controlled right steering input. Watch the trailer start to angle.",
      backgroundColor: "#0891b2",
      textColor: "white",
    };
  }

  if (stepIndex === 2) {
    return {
      title: "FOLLOW THE TRAILER",
      message:
        backingSide === "left"
          ? "Now steer right to follow the trailer and avoid over-turning."
          : "Now steer left to follow the trailer and avoid over-turning.",
      backgroundColor: "#0891b2",
      textColor: "white",
    };
  }

  if (stepIndex === 3) {
    return {
      title: "STRAIGHTEN NOW",
      message:
        "Straighten the wheel slowly before the trailer angle gets too sharp.",
      backgroundColor: "#7c3aed",
      textColor: "white",
    };
  }

  return {
    title: "STOP AND VERIFY",
    message:
      "Stop, check both mirrors, verify clearance, and only continue if the site is clear.",
    backgroundColor: "#0f172a",
    textColor: "white",
  };
}

export function AutoCoachingBanner({
  stepIndex,
  backingSide,
  scenario,
  obstacles,
}: Props) {
  const coaching = getCoachingMessage({
    stepIndex,
    backingSide,
    scenario,
    obstacles,
  });

  return (
    <View
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: coaching.backgroundColor,
      }}
    >
      <Text
        style={{
          color: coaching.textColor,
          textAlign: "center",
          fontSize: 18,
          fontWeight: "900",
        }}
      >
        {coaching.title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          color: coaching.textColor,
          textAlign: "center",
          fontSize: 14,
          fontWeight: "700",
          lineHeight: 20,
        }}
      >
        {coaching.message}
      </Text>
    </View>
  );
}
