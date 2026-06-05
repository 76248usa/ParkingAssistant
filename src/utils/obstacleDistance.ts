import { SiteObstacle } from "../components/SiteObstacleSelector";

export type Scenario = "easy" | "normal" | "tight";
export type BackingSide = "left" | "right";

export type ObstacleDistance = {
  id: SiteObstacle;
  label: string;
  emoji: string;
  distance: number;
  clearanceLabel: "Good" | "Caution" | "Close" | "Critical";
  riskLevel: "low" | "medium" | "high";
  note: string;
};

function getScenarioAdjustment(scenario: Scenario) {
  if (scenario === "easy") return 2;
  if (scenario === "tight") return -1;
  return 0;
}

function getStepAdjustment(stepIndex: number) {
  if (stepIndex === 0) return 2;
  if (stepIndex === 1) return 0;
  if (stepIndex === 2) return -1;
  if (stepIndex === 3) return -2;
  return -3;
}

function getTrailerAnglePenalty(trailerAngle: number) {
  const angle = Math.abs(trailerAngle);

  if (angle >= 35) return 4;
  if (angle >= 25) return 3;
  if (angle >= 15) return 2;
  if (angle >= 8) return 1;

  return 0;
}

export function getClearanceLabel(
  distance: number,
): ObstacleDistance["clearanceLabel"] {
  if (distance <= 2) return "Critical";
  if (distance <= 4) return "Close";
  if (distance <= 6) return "Caution";
  return "Good";
}

export function getRiskLevelFromDistance(
  distance: number,
): ObstacleDistance["riskLevel"] {
  if (distance <= 2) return "high";
  if (distance <= 4) return "medium";
  return "low";
}

export function getClearanceColor(distance: number) {
  if (distance <= 2) return "#dc2626";
  if (distance <= 4) return "#ea580c";
  if (distance <= 6) return "#ca8a04";
  return "#16a34a";
}

function calculateDistance({
  baseDistance,
  stepIndex,
  scenario,
  trailerAngle,
}: {
  baseDistance: number;
  stepIndex: number;
  scenario: Scenario;
  trailerAngle: number;
}) {
  const distance =
    baseDistance +
    getScenarioAdjustment(scenario) +
    getStepAdjustment(stepIndex) -
    getTrailerAnglePenalty(trailerAngle);

  return Math.max(1, distance);
}

export function getObstacleDistances({
  stepIndex,
  backingSide,
  scenario,
  obstacles,
  trailerAngle = 0,
}: {
  stepIndex: number;
  backingSide: BackingSide;
  scenario: Scenario;
  obstacles: SiteObstacle[];
  trailerAngle?: number;
}): ObstacleDistance[] {
  return obstacles.map((obstacle) => {
    if (obstacle === "treeLeft") {
      const distance = calculateDistance({
        baseDistance: backingSide === "left" ? 5 : 7,
        stepIndex,
        scenario,
        trailerAngle,
      });

      return {
        id: obstacle,
        label: "Tree left",
        emoji: "🌳",
        distance,
        clearanceLabel: getClearanceLabel(distance),
        riskLevel: getRiskLevelFromDistance(distance),
        note:
          backingSide === "left"
            ? "Driver-side clearance is tighter."
            : "Tree is on the opposite side.",
      };
    }

    if (obstacle === "poleRight") {
      const distance = calculateDistance({
        baseDistance: backingSide === "right" ? 4 : 6,
        stepIndex,
        scenario,
        trailerAngle,
      });

      return {
        id: obstacle,
        label: "Pole right",
        emoji: "🚧",
        distance,
        clearanceLabel: getClearanceLabel(distance),
        riskLevel: getRiskLevelFromDistance(distance),
        note:
          backingSide === "right"
            ? "Passenger-side pole is harder to see."
            : "Watch trailer swing toward the pole.",
      };
    }

    if (obstacle === "lowBranch") {
      const distance = calculateDistance({
        baseDistance: scenario === "tight" ? 4 : 6,
        stepIndex,
        scenario,
        trailerAngle,
      });

      return {
        id: obstacle,
        label: "Low branch",
        emoji: "🌿",
        distance,
        clearanceLabel: getClearanceLabel(distance),
        riskLevel: getRiskLevelFromDistance(distance),
        note: "Check roof and A/C clearance before backing deeper.",
      };
    }

    const distance = calculateDistance({
      baseDistance: scenario === "tight" ? 3 : 5,
      stepIndex,
      scenario,
      trailerAngle,
    });

    return {
      id: obstacle,
      label: "Hookup side",
      emoji: "⚡",
      distance,
      clearanceLabel: getClearanceLabel(distance),
      riskLevel: getRiskLevelFromDistance(distance),
      note: "Leave room for water, sewer, and electric hookups.",
    };
  });
}

export function getOverallRiskLevel(
  distances: ObstacleDistance[],
  scenario: Scenario,
  stepIndex: number,
  trailerAngle = 0,
): "low" | "medium" | "high" {
  const hasHighRiskDistance = distances.some(
    (item) => item.riskLevel === "high",
  );

  const hasMediumRiskDistance = distances.some(
    (item) => item.riskLevel === "medium",
  );

  const absTrailerAngle = Math.abs(trailerAngle);

  if (hasHighRiskDistance) return "high";

  if (absTrailerAngle >= 35) return "high";

  if (scenario === "tight" && stepIndex >= 3) return "high";

  if (hasMediumRiskDistance) return "medium";

  if (absTrailerAngle >= 25) return "medium";

  if (scenario === "tight" && stepIndex >= 2) return "medium";

  if (distances.length >= 3 && stepIndex >= 2) return "medium";

  return "low";
}
