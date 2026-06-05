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

function getRiskTitle(riskLevel: "low" | "medium" | "high") {
  if (riskLevel === "high") return "High Collision Risk";
  if (riskLevel === "medium") return "Moderate Collision Risk";
  return "Low Collision Risk";
}

function getRiskColors(riskLevel: "low" | "medium" | "high") {
  if (riskLevel === "high") {
    return {
      backgroundColor: "#fee2e2",
      borderColor: "#ef4444",
      textColor: "#7f1d1d",
    };
  }

  if (riskLevel === "medium") {
    return {
      backgroundColor: "#fff7ed",
      borderColor: "#fb923c",
      textColor: "#7c2d12",
    };
  }

  return {
    backgroundColor: "#dcfce7",
    borderColor: "#22c55e",
    textColor: "#14532d",
  };
}

export function CollisionRiskCard({
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
  const colors = getRiskColors(riskLevel);

  const hasObstacles = distances.length > 0;

  return (
    <View
      style={{
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        marginTop: 12,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "900",
          color: colors.textColor,
          marginBottom: 6,
        }}
      >
        {getRiskTitle(riskLevel)}
      </Text>

      {!hasObstacles ? (
        <Text
          style={{
            fontSize: 14,
            color: colors.textColor,
            fontWeight: "700",
          }}
        >
          ✅ Clear: no major collision risks detected.
        </Text>
      ) : (
        distances.map((item) => {
          const message =
            item.riskLevel === "high"
              ? `${item.emoji} ${item.label}: ${item.distance} ft clearance — STOP and correct before backing farther.`
              : item.riskLevel === "medium"
                ? `${item.emoji} ${item.label}: ${item.distance} ft clearance — continue slowly and correct early.`
                : `${item.emoji} ${item.label}: ${item.distance} ft clearance — looks acceptable.`;

          return (
            <Text
              key={item.id}
              style={{
                fontSize: 14,
                color: colors.textColor,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              {message}
            </Text>
          );
        })
      )}

      {scenario === "tight" && stepIndex >= 2 ? (
        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            color: colors.textColor,
            fontWeight: "800",
          }}
        >
          ⚠️ Tight site: use smaller steering corrections and stop more often.
        </Text>
      ) : null}

      {stepIndex >= 3 ? (
        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: colors.textColor,
            fontWeight: "800",
          }}
        >
          ⚠️ Jackknife risk increases here. Straighten slowly.
        </Text>
      ) : null}

      {backingSide === "right" && obstacles.includes("poleRight") ? (
        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: colors.textColor,
            fontWeight: "800",
          }}
        >
          🚧 Extra caution: right-side backing with a right-side pole is harder
          to see.
        </Text>
      ) : null}
    </View>
  );
}
