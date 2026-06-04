import { Text, View } from "react-native";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  truckAngle: number;
  trailerAngle: number;
  scenario: Scenario;
};

export function HitchAngleIndicator({
  truckAngle,
  trailerAngle,
  scenario,
}: Props) {
  const hitchAngle = Math.abs(trailerAngle - truckAngle);

  const safeLimit = scenario === "easy" ? 25 : scenario === "normal" ? 20 : 15;

  const cautionLimit =
    scenario === "easy" ? 40 : scenario === "normal" ? 35 : 28;

  const status =
    hitchAngle >= cautionLimit
      ? "JACKKNIFE RISK"
      : hitchAngle >= safeLimit
        ? "CAUTION"
        : "SAFE";

  const color =
    status === "JACKKNIFE RISK"
      ? "#dc2626"
      : status === "CAUTION"
        ? "#f97316"
        : "#16a34a";

  const percent = Math.min((hitchAngle / cautionLimit) * 100, 100);

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
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
        }}
      >
        HITCH ANGLE
      </Text>

      <Text
        style={{
          marginTop: 6,
          textAlign: "center",
          fontSize: 20,
          fontWeight: "900",
          color,
        }}
      >
        {status}
      </Text>

      <Text
        style={{
          marginTop: 4,
          textAlign: "center",
          fontSize: 14,
          fontWeight: "700",
          color: "#0f172a",
        }}
      >
        {Math.round(hitchAngle)}°
      </Text>

      <Text
        style={{
          marginTop: 4,
          textAlign: "center",
          fontSize: 12,
          fontWeight: "700",
          color: "#64748b",
        }}
      >
        {scenario === "easy"
          ? "Easy mode: more forgiving"
          : scenario === "normal"
            ? "Normal mode: standard limits"
            : "Tight mode: stricter limits"}
      </Text>

      <View
        style={{
          marginTop: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: "#e2e8f0",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${percent}%`,
            height: "100%",
            borderRadius: 999,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}
