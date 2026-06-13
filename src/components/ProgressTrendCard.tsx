import { Text, View } from "react-native";
import { PracticeSession } from "./PracticeHistoryCard";

type Props = {
  sessions: PracticeSession[];
};

function getAverageScore(sessions: PracticeSession[]) {
  if (sessions.length === 0) return 0;

  const total = sessions.reduce((sum, session) => sum + session.score, 0);
  return Math.round(total / sessions.length);
}

function getBestScore(sessions: PracticeSession[]) {
  if (sessions.length === 0) return 0;

  return Math.max(...sessions.map((session) => session.score));
}

function getTotalAutoStops(sessions: PracticeSession[]) {
  return sessions.reduce((sum, session) => sum + session.stats.autoStops, 0);
}

function getTotalRecoveries(sessions: PracticeSession[]) {
  return sessions.reduce(
    (sum, session) => sum + session.stats.recoveryCompletions,
    0,
  );
}

function getTrendMessage({
  latestScore,
  averageScore,
  totalAutoStops,
  totalRecoveries,
}: {
  latestScore: number;
  averageScore: number;
  totalAutoStops: number;
  totalRecoveries: number;
}) {
  if (latestScore > averageScore) {
    return "Latest run is above your average. Good improvement.";
  }

  if (latestScore === averageScore) {
    return "Latest run matches your average. Keep practicing for consistency.";
  }

  if (totalAutoStops > 0 && totalRecoveries > 0) {
    return "You are practicing safe recovery. Next goal: reduce auto-stops.";
  }

  if (totalAutoStops > 0) {
    return "Auto-stops are still happening. Pull forward sooner and use smaller corrections.";
  }

  return "Good control overall. Keep focusing on smooth steering and early straightening.";
}

function getScoreColor(score: number) {
  if (score >= 85) return "#16a34a";
  if (score >= 70) return "#0891b2";
  if (score >= 55) return "#f97316";
  return "#dc2626";
}

export function ProgressTrendCard({ sessions }: Props) {
  if (sessions.length === 0) {
    return null;
  }

  const latestSession = sessions[0];
  const latestScore = latestSession.score;
  const averageScore = getAverageScore(sessions);
  const bestScore = getBestScore(sessions);
  const totalAutoStops = getTotalAutoStops(sessions);
  const totalRecoveries = getTotalRecoveries(sessions);

  const trendMessage = getTrendMessage({
    latestScore,
    averageScore,
    totalAutoStops,
    totalRecoveries,
  });

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#f0fdf4",
        borderWidth: 1,
        borderColor: "#86efac",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: "#166534",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Progress Trend
      </Text>

      <View
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 12,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#bbf7d0",
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "900",
            color: "#0f172a",
            textAlign: "center",
          }}
        >
          Latest Score
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 30,
            fontWeight: "900",
            color: getScoreColor(latestScore),
            textAlign: "center",
          }}
        >
          {latestScore}/100
        </Text>
      </View>

      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          gap: 8,
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 12,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#bbf7d0",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "900",
              color: "#475569",
              textAlign: "center",
            }}
          >
            Average
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 20,
              fontWeight: "900",
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            {averageScore}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 12,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#bbf7d0",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "900",
              color: "#475569",
              textAlign: "center",
            }}
          >
            Best
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 20,
              fontWeight: "900",
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            {bestScore}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 12,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#bbf7d0",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "900",
              color: "#475569",
              textAlign: "center",
            }}
          >
            Sessions
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 20,
              fontWeight: "900",
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            {sessions.length}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10, gap: 5 }}>
        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          Total auto-stops: {totalAutoStops}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          Total recoveries: {totalRecoveries}
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
          Trend note
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
          {trendMessage}
        </Text>
      </View>
    </View>
  );
}
