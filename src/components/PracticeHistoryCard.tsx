import { Text, View } from "react-native";
import { SessionStats } from "./SessionStatsCard";

type Scenario = "easy" | "normal" | "tight";

export type PracticeSession = {
  id: string;
  completedAt: string;
  scenario: Scenario;
  backingSide: "left" | "right";
  score: number;
  stats: SessionStats;
};

type Props = {
  sessions: PracticeSession[];
};

function getScenarioLabel(scenario: Scenario) {
  if (scenario === "easy") return "Easy";
  if (scenario === "tight") return "Tight";
  return "Normal";
}

function getBackingSideLabel(backingSide: "left" | "right") {
  return backingSide === "left" ? "Left-side" : "Right-side";
}

export function PracticeHistoryCard({ sessions }: Props) {
  if (sessions.length === 0) {
    return null;
  }

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
        }}
      >
        Recent Practice Sessions
      </Text>

      <View style={{ marginTop: 10, gap: 10 }}>
        {sessions.slice(0, 5).map((session) => (
          <View
            key={session.id}
            style={{
              padding: 10,
              borderRadius: 12,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#e2e8f0",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "900",
                color: "#0f172a",
              }}
            >
              {session.completedAt} — {getScenarioLabel(session.scenario)} /{" "}
              {getBackingSideLabel(session.backingSide)}
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 18,
                fontWeight: "900",
                color:
                  session.score >= 85
                    ? "#16a34a"
                    : session.score >= 70
                      ? "#0891b2"
                      : session.score >= 55
                        ? "#f97316"
                        : "#dc2626",
              }}
            >
              Score: {session.score}/100
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 12,
                fontWeight: "700",
                color: "#475569",
                lineHeight: 17,
              }}
            >
              Auto stops: {session.stats.autoStops} • Recoveries:{" "}
              {session.stats.recoveryCompletions} • Pull-forwards:{" "}
              {session.stats.pullForwards} • Steering corrections:{" "}
              {session.stats.steeringCorrections}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
