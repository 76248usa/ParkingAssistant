import { Text, View } from "react-native";

type Props = {
  truckAngle: number;
  trailerAngle: number;
};

export function HitchAngleIndicator({ truckAngle, trailerAngle }: Props) {
  const hitchAngle = Math.abs(trailerAngle - truckAngle);

  const status =
    hitchAngle >= 36 ? "JACKKNIFE RISK" : hitchAngle >= 21 ? "CAUTION" : "SAFE";

  const color =
    status === "JACKKNIFE RISK"
      ? "#dc2626"
      : status === "CAUTION"
        ? "#f97316"
        : "#16a34a";

  const percent = Math.min((hitchAngle / 45) * 100, 100);

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
