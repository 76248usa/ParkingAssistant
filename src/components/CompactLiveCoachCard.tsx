import { Text, View } from "react-native";
import { PracticeAction } from "./PracticeModeControls";
import { SiteObstacle } from "./SiteObstacleSelector";

type Scenario = "easy" | "normal" | "tight";
type BackingSide = "left" | "right";

type Props = {
  stepIndex: number;
  backingSide: BackingSide;
  scenario: Scenario;
  obstacles: SiteObstacle[];
  trailerAngle: number;
  steeringAngle: number;
  practiceAction: PracticeAction;
  jackknifeAutoStopActive: boolean;
  isRecoveringFromJackknife: boolean;
};

type ObstacleDistance = {
  label: string;
  emoji: string;
  distance: number;
};

function getObstacleDistances({
  stepIndex,
  backingSide,
  scenario,
  obstacles,
  trailerAngle,
}: {
  stepIndex: number;
  backingSide: BackingSide;
  scenario: Scenario;
  obstacles: SiteObstacle[];
  trailerAngle: number;
}) {
  const distances: ObstacleDistance[] = [];

  const scenarioPenalty =
    scenario === "tight" ? 2 : scenario === "normal" ? 1 : 0;
  const stepPenalty = Math.min(stepIndex, 4) * 0.5;
  const anglePenalty = Math.abs(trailerAngle) / 12;

  const baseDistance = Math.max(
    1,
    Math.round(10 - scenarioPenalty - stepPenalty - anglePenalty),
  );

  if (obstacles.includes("poleRight")) {
    distances.push({
      label: "Pole right",
      emoji: "🚧",
      distance:
        backingSide === "right" ? Math.max(1, baseDistance - 2) : baseDistance,
    });
  }

  if (obstacles.includes("treeLeft")) {
    distances.push({
      label: "Tree left",
      emoji: "🌳",
      distance:
        backingSide === "left" ? Math.max(1, baseDistance - 2) : baseDistance,
    });
  }

  if (obstacles.includes("lowBranch")) {
    distances.push({
      label: "Low branch",
      emoji: "🌿",
      distance: Math.max(1, baseDistance - 1),
    });
  }

  if (obstacles.includes("tightHookupSide")) {
    distances.push({
      label: "Hookup side",
      emoji: "⚡",
      distance: Math.max(1, baseDistance - 1),
    });
  }

  return distances;
}

function getOverallRiskLevel({
  distances,
  scenario,
  stepIndex,
  trailerAngle,
  jackknifeAutoStopActive,
}: {
  distances: ObstacleDistance[];
  scenario: Scenario;
  stepIndex: number;
  trailerAngle: number;
  jackknifeAutoStopActive: boolean;
}) {
  if (jackknifeAutoStopActive) return "high";

  const closestDistance =
    distances.length > 0
      ? Math.min(...distances.map((item) => item.distance))
      : 10;

  const angleRisk = Math.abs(trailerAngle) >= 28;
  const tightRisk = scenario === "tight" && closestDistance <= 4;
  const lateStepRisk = stepIndex >= 3 && closestDistance <= 4;

  if (closestDistance <= 3 || angleRisk || tightRisk) {
    return "high";
  }

  if (closestDistance <= 5 || lateStepRisk || Math.abs(trailerAngle) >= 18) {
    return "medium";
  }

  return "low";
}

function getTrainingLabel({
  stepIndex,
  jackknifeAutoStopActive,
  isRecoveringFromJackknife,
}: {
  stepIndex: number;
  jackknifeAutoStopActive: boolean;
  isRecoveringFromJackknife: boolean;
}) {
  if (jackknifeAutoStopActive) return "Stop backing";
  if (isRecoveringFromJackknife) return "Recover slowly";
  if (stepIndex === 0) return "Good setup";
  if (stepIndex === 1) return "Start turn";
  if (stepIndex === 2) return "Follow trailer";
  if (stepIndex === 3) return "Straighten now";
  return "Stop and check";
}

function getTrainingEmoji({
  stepIndex,
  jackknifeAutoStopActive,
  isRecoveringFromJackknife,
}: {
  stepIndex: number;
  jackknifeAutoStopActive: boolean;
  isRecoveringFromJackknife: boolean;
}) {
  if (jackknifeAutoStopActive) return "🛑";
  if (isRecoveringFromJackknife) return "↗️";
  if (stepIndex === 0) return "✅";
  if (stepIndex === 3) return "🎯";
  if (stepIndex >= 4) return "🛑";
  return "➡️";
}

function getCoachTip({
  riskLevel,
  stepIndex,
  practiceAction,
  jackknifeAutoStopActive,
  isRecoveringFromJackknife,
}: {
  riskLevel: "low" | "medium" | "high";
  stepIndex: number;
  practiceAction: PracticeAction;
  jackknifeAutoStopActive: boolean;
  isRecoveringFromJackknife: boolean;
}) {
  if (jackknifeAutoStopActive) return "Pull forward to straighten.";
  if (isRecoveringFromJackknife) return "Keep pulling forward slowly.";
  if (riskLevel === "high") return "Stop and check clearance.";
  if (riskLevel === "medium") return "Slow down and make small corrections.";
  if (stepIndex === 3) return "Straighten before backing deeper.";
  if (practiceAction === "backing") return "Keep backing slowly.";
  return "Use small steering corrections.";
}

function getRiskStyle(riskLevel: "low" | "medium" | "high") {
  if (riskLevel === "high") {
    return {
      label: "High risk",
      emoji: "🔴",
      color: "#991b1b",
      backgroundColor: "#fee2e2",
      borderColor: "#ef4444",
    };
  }

  if (riskLevel === "medium") {
    return {
      label: "Medium risk",
      emoji: "🟠",
      color: "#9a3412",
      backgroundColor: "#fff7ed",
      borderColor: "#fdba74",
    };
  }

  return {
    label: "Low risk",
    emoji: "🟢",
    color: "#166534",
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  };
}

export function CompactLiveCoachCard({
  stepIndex,
  backingSide,
  scenario,
  obstacles,
  trailerAngle,
  steeringAngle,
  practiceAction,
  jackknifeAutoStopActive,
  isRecoveringFromJackknife,
}: Props) {
  const distances = getObstacleDistances({
    stepIndex,
    backingSide,
    scenario,
    obstacles,
    trailerAngle,
  });

  const riskLevel = getOverallRiskLevel({
    distances,
    scenario,
    stepIndex,
    trailerAngle,
    jackknifeAutoStopActive,
  });

  const riskStyle = getRiskStyle(riskLevel);

  const closestObstacle =
    distances.length > 0
      ? distances.reduce((closest, item) =>
          item.distance < closest.distance ? item : closest,
        )
      : null;

  const trainingEmoji = getTrainingEmoji({
    stepIndex,
    jackknifeAutoStopActive,
    isRecoveringFromJackknife,
  });

  const trainingLabel = getTrainingLabel({
    stepIndex,
    jackknifeAutoStopActive,
    isRecoveringFromJackknife,
  });

  const coachTip = getCoachTip({
    riskLevel,
    stepIndex,
    practiceAction,
    jackknifeAutoStopActive,
    isRecoveringFromJackknife,
  });

  const absSteeringAngle = Math.abs(Math.round(steeringAngle));
  const absTrailerAngle = Math.abs(Math.round(trailerAngle));

  return (
    <View
      style={{
        marginTop: 10,
        padding: 10,
        borderRadius: 14,
        backgroundColor: riskStyle.backgroundColor,
        borderWidth: 1,
        borderColor: riskStyle.borderColor,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: "900",
          color: riskStyle.color,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Live Coach
      </Text>

      <View
        style={{
          marginTop: 6,
          flexDirection: "row",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "900",
              color: riskStyle.color,
            }}
          >
            {trainingEmoji} {trainingLabel}
          </Text>

          <Text
            style={{
              marginTop: 3,
              fontSize: 12,
              fontWeight: "800",
              color: "#334155",
            }}
          >
            Steer {absSteeringAngle}° • Trailer {absTrailerAngle}°
          </Text>
        </View>

        <View
          style={{
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderRadius: 999,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: riskStyle.borderColor,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "900",
              color: riskStyle.color,
            }}
          >
            {riskStyle.emoji} {riskStyle.label}
          </Text>
        </View>
      </View>

      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          fontWeight: "800",
          color: "#334155",
          lineHeight: 17,
        }}
      >
        {closestObstacle
          ? `${closestObstacle.emoji} ${closestObstacle.label}: ${closestObstacle.distance} ft • ${coachTip}`
          : `No selected obstacles • ${coachTip}`}
      </Text>
    </View>
  );
}
