import { Text, View } from "react-native";
import { SessionStats } from "./SessionStatsCard";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  scenario: Scenario;
  backingSide: "left" | "right";
  sessionStats: SessionStats;
  score?: number;
};

function getScenarioLabel(scenario: Scenario) {
  if (scenario === "easy") return "Easy site";
  if (scenario === "tight") return "Tight site";
  return "Normal site";
}

function getBackingSideLabel(backingSide: "left" | "right") {
  return backingSide === "left" ? "Left-side back-in" : "Right-side back-in";
}

function getMainCoachingNote({
  scenario,
  sessionStats,
}: {
  scenario: Scenario;
  sessionStats: SessionStats;
}) {
  if (sessionStats.recoveryCompletions > 0) {
    return "Good recovery. Next time, start straightening earlier before the trailer reaches the auto-stop angle.";
  }

  if (sessionStats.autoStops > 0) {
    return "Auto-stop was triggered. Pull forward sooner when the trailer angle starts increasing quickly.";
  }

  if (sessionStats.steeringCorrections > 8) {
    return "You made several steering corrections. Focus on smaller, slower steering inputs.";
  }

  if (sessionStats.pullForwards > 3) {
    return "You used several pull-forward corrections. That is safe, but try to set up straighter before backing.";
  }

  if (scenario === "tight") {
    return "Tight site completed. Keep using small corrections and stop often to check your angle.";
  }

  if (scenario === "easy") {
    return "Good practice setup. Focus on smooth steering and mirror checks.";
  }

  return "Good practice run. Keep watching the trailer angle and straighten early.";
}
function getPerformanceLabel(sessionStats: SessionStats) {
  if (sessionStats.autoStops === 0 && sessionStats.recoveryCompletions === 0) {
    return "Controlled practice";
  }

  if (sessionStats.autoStops > 0 && sessionStats.recoveryCompletions > 0) {
    return "Recovered safely";
  }

  if (sessionStats.autoStops > 0) {
    return "Auto-stop triggered";
  }

  return "Practice completed";
}
export function SessionSummaryCard({
  scenario,
  backingSide,
  sessionStats,
  score,
}: Props) {
  const totalActions =
    sessionStats.backUps +
    sessionStats.pullForwards +
    sessionStats.steeringCorrections;

  const mainCoachingNote = getMainCoachingNote({
    scenario,
    sessionStats,
  });

  const performanceLabel = getPerformanceLabel(sessionStats);

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
          textAlign: "center",
          fontSize: 12,
          fontWeight: "900",
          color: "#334155",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Session Summary
      </Text>

      <View
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 12,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "900",
            color: "#0f172a",
            textAlign: "center",
          }}
        >
          {performanceLabel}
        </Text>

        {score != null ? (
          <Text
            style={{
              marginTop: 4,
              fontSize: 22,
              fontWeight: "900",
              color: "#0891b2",
              textAlign: "center",
            }}
          >
            Score: {score}/100
          </Text>
        ) : null}
      </View>

      <View style={{ marginTop: 10, gap: 5 }}>
        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          Scenario: {getScenarioLabel(scenario)}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          Backing side: {getBackingSideLabel(backingSide)}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          Total practice actions: {totalActions}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#991b1b" }}>
          Auto stops: {sessionStats.autoStops}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#14532d" }}>
          Recoveries completed: {sessionStats.recoveryCompletions}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          Pull-forward corrections: {sessionStats.pullForwards}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          Steering corrections: {sessionStats.steeringCorrections}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          Back up actions: {sessionStats.backUps}
        </Text>
      </View>

      <View
        style={{
          marginTop: 12,
          padding: 10,
          borderRadius: 12,
          backgroundColor: "#ecfeff",
          borderWidth: 1,
          borderColor: "#67e8f9",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "900",
            color: "#0e7490",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Main coaching note
        </Text>

        <Text
          style={{
            marginTop: 5,
            fontSize: 13,
            fontWeight: "800",
            color: "#0f172a",
            lineHeight: 18,
          }}
        >
          {mainCoachingNote}
        </Text>
      </View>
    </View>
  );
}
