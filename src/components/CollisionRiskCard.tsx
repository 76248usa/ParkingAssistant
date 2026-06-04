import { Text, View } from "react-native";
import { SiteObstacle } from "./SiteObstacleSelector";

type Props = {
  stepIndex: number;
  backingSide: "left" | "right";
  scenario: "easy" | "normal" | "tight";
  obstacles: SiteObstacle[];
};

function getRiskLevel(
  stepIndex: number,
  scenario: "easy" | "normal" | "tight",
  obstacles: SiteObstacle[],
) {
  let risk = 0;

  risk += stepIndex;

  if (scenario === "normal") risk += 1;
  if (scenario === "tight") risk += 2;

  risk += obstacles.length;

  if (risk >= 6) return "high";
  if (risk >= 3) return "medium";
  return "low";
}

function getRiskMessages({
  stepIndex,
  backingSide,
  scenario,
  obstacles,
}: Props) {
  const messages: string[] = [];

  if (obstacles.includes("poleRight")) {
    messages.push(
      "🚧 Pole collision risk: watch passenger-side trailer swing.",
    );
  }

  if (obstacles.includes("treeLeft")) {
    messages.push(
      "🌳 Tree clearance risk: keep the trailer from drifting left.",
    );
  }

  if (obstacles.includes("lowBranch")) {
    messages.push(
      "🌿 Roof clearance warning: check overhead space before backing deeper.",
    );
  }

  if (obstacles.includes("tightHookupSide")) {
    messages.push("⚡ Utility-side clearance: leave room for hookups.");
  }

  if (scenario === "tight" && stepIndex >= 2) {
    messages.push(
      "⚠️ Tight site: correct early and avoid sharp steering changes.",
    );
  }

  if (stepIndex >= 3) {
    messages.push("⚠️ Jackknife risk increases here. Straighten slowly.");
  }

  if (backingSide === "right" && obstacles.includes("poleRight")) {
    messages.push(
      "🚧 Extra caution: right-side backing with a right-side pole is harder to see.",
    );
  }

  if (messages.length === 0) {
    messages.push("✅ Clear: no major collision risks detected.");
  }

  return messages;
}

export function CollisionRiskCard({
  stepIndex,
  backingSide,
  scenario,
  obstacles,
}: Props) {
  const riskLevel = getRiskLevel(stepIndex, scenario, obstacles);

  const messages = getRiskMessages({
    stepIndex,
    backingSide,
    scenario,
    obstacles,
  });

  const backgroundColor =
    riskLevel === "high"
      ? "#fee2e2"
      : riskLevel === "medium"
        ? "#fff7ed"
        : "#dcfce7";

  const borderColor =
    riskLevel === "high"
      ? "#ef4444"
      : riskLevel === "medium"
        ? "#fb923c"
        : "#22c55e";

  const title =
    riskLevel === "high"
      ? "High Collision Risk"
      : riskLevel === "medium"
        ? "Moderate Collision Risk"
        : "Low Collision Risk";

  return (
    <View
      style={{
        backgroundColor,
        borderColor,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        marginTop: 12,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "800",
          marginBottom: 6,
        }}
      >
        {title}
      </Text>

      {messages.map((message) => (
        <Text
          key={message}
          style={{
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          {message}
        </Text>
      ))}
    </View>
  );
}
