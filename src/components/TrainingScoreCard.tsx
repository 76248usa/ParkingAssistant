import { Text, View } from "react-native";
import { SessionStats } from "./SessionStatsCard";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  stepIndex: number;
  totalSteps: number;
  steeringAngle: number;
  truckAngle: number;
  trailerAngle: number;
  scenario: Scenario;
  sessionStats: SessionStats;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getScenarioLabel(scenario: Scenario) {
  if (scenario === "easy") return "Easy";
  if (scenario === "tight") return "Tight";
  return "Normal";
}

function getTrailerAnglePenalty(trailerAngle: number, scenario: Scenario) {
  const angle = Math.abs(trailerAngle);

  const safeLimit = scenario === "easy" ? 24 : scenario === "tight" ? 14 : 18;
  const warningLimit =
    scenario === "easy" ? 34 : scenario === "tight" ? 24 : 28;

  if (angle <= safeLimit) return 0;
  if (angle <= warningLimit) return 8;
  return 16;
}

function getSteeringPenalty(steeringCorrections: number) {
  if (steeringCorrections <= 6) return 0;
  return (steeringCorrections - 6) * 2;
}

function getScoreMessage(score: number, sessionStats: SessionStats) {
  if (sessionStats.autoStops > 0 && sessionStats.recoveryCompletions > 0) {
    return "Good recovery. Next goal: reduce trailer angle before auto-stop.";
  }

  if (sessionStats.autoStops > 0) {
    return "Auto-stop triggered. Pull forward earlier when trailer angle increases.";
  }

  if (score >= 90) {
    return "Excellent control. Smooth steering and safe trailer angle.";
  }

  if (score >= 75) {
    return "Good practice run. Keep corrections small and controlled.";
  }

  if (score >= 60) {
    return "Fair run. Slow down and straighten sooner.";
  }

  return "Needs practice. Use smaller steering inputs and pull forward sooner.";
}

function getScoreColor(score: number) {
  if (score >= 85) return "#16a34a";
  if (score >= 70) return "#0891b2";
  if (score >= 55) return "#f97316";
  return "#dc2626";
}

export function TrainingScoreCard({
  stepIndex,
  totalSteps,
  steeringAngle,
  truckAngle,
  trailerAngle,
  scenario,
  sessionStats,
}: Props) {
  const progressScore = Math.round(((stepIndex + 1) / totalSteps) * 10);

  const trailerPenalty = getTrailerAnglePenalty(trailerAngle, scenario);
  const steeringPenalty = getSteeringPenalty(sessionStats.steeringCorrections);
  const autoStopPenalty = sessionStats.autoStops * 15;
  const pullForwardPenalty = sessionStats.pullForwards * 3;

  const recoveryBonus =
    sessionStats.recoveryCompletions > 0
      ? sessionStats.recoveryCompletions * 5
      : 0;

  const rawScore =
    100 +
    progressScore +
    recoveryBonus -
    trailerPenalty -
    steeringPenalty -
    autoStopPenalty -
    pullForwardPenalty;

  const score = clamp(Math.round(rawScore), 0, 100);
  const scoreColor = getScoreColor(score);
  const message = getScoreMessage(score, sessionStats);

  const maxAngle = Math.max(
    Math.abs(steeringAngle),
    Math.abs(truckAngle),
    Math.abs(trailerAngle),
  );

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#cbd5e1",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: "#334155",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          textAlign: "center",
        }}
      >
        Training Score
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 34,
          fontWeight: "900",
          color: scoreColor,
          textAlign: "center",
        }}
      >
        {score}/100
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 13,
          fontWeight: "800",
          color: "#0f172a",
          textAlign: "center",
          lineHeight: 18,
        }}
      >
        {message}
      </Text>

      <View
        style={{
          marginTop: 12,
          padding: 10,
          borderRadius: 12,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "900", color: "#334155" }}>
          Score factors
        </Text>

        <Text style={{ marginTop: 6, fontSize: 12, color: "#475569" }}>
          Scenario: {getScenarioLabel(scenario)}
        </Text>

        <Text style={{ marginTop: 4, fontSize: 12, color: "#475569" }}>
          Max current angle: {Math.round(maxAngle)}°
        </Text>

        <Text style={{ marginTop: 4, fontSize: 12, color: "#475569" }}>
          Auto stops: {sessionStats.autoStops}{" "}
          {sessionStats.autoStops > 0 ? `(-${autoStopPenalty})` : ""}
        </Text>

        <Text style={{ marginTop: 4, fontSize: 12, color: "#475569" }}>
          Pull-forward corrections: {sessionStats.pullForwards}{" "}
          {sessionStats.pullForwards > 0 ? `(-${pullForwardPenalty})` : ""}
        </Text>

        <Text style={{ marginTop: 4, fontSize: 12, color: "#475569" }}>
          Steering corrections: {sessionStats.steeringCorrections}{" "}
          {steeringPenalty > 0 ? `(-${steeringPenalty})` : ""}
        </Text>

        <Text style={{ marginTop: 4, fontSize: 12, color: "#475569" }}>
          Recoveries completed: {sessionStats.recoveryCompletions}{" "}
          {recoveryBonus > 0 ? `(+${recoveryBonus})` : ""}
        </Text>
      </View>
    </View>
  );
}
