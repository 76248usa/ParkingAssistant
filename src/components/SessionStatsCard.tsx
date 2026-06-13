import { Text, View } from "react-native";

export type SessionStats = {
  backUps: number;
  pullForwards: number;
  steeringCorrections: number;
  autoStops: number;
  recoveryCompletions: number;
};

type Props = {
  stats: SessionStats;
};

export function SessionStatsCard({ stats }: Props) {
  const totalActions =
    stats.backUps + stats.pullForwards + stats.steeringCorrections;

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
        Practice Session Stats
      </Text>

      <View style={{ marginTop: 10, gap: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          ⬇️ Back up actions: {stats.backUps}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          ⬆️ Pull forward corrections: {stats.pullForwards}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>
          ↔️ Steering corrections: {stats.steeringCorrections}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#991b1b" }}>
          🛑 Auto stops: {stats.autoStops}
        </Text>

        <Text style={{ fontSize: 13, fontWeight: "800", color: "#14532d" }}>
          ✅ Recoveries completed: {stats.recoveryCompletions}
        </Text>
      </View>

      <View
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 12,
          backgroundColor: "#ecfeff",
          borderWidth: 1,
          borderColor: "#67e8f9",
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "900",
            color: "#0e7490",
            textAlign: "center",
          }}
        >
          Total practice actions: {totalActions}
        </Text>
      </View>
    </View>
  );
}
