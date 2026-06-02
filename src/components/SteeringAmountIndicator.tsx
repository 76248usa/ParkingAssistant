import { Text, View } from "react-native";

type Props = {
  steeringAngle: number;
};

export function SteeringAmountIndicator({ steeringAngle }: Props) {
  const absAngle = Math.abs(steeringAngle);

  const direction =
    steeringAngle < 0 ? "LEFT" : steeringAngle > 0 ? "RIGHT" : "CENTER";

  const amount =
    absAngle === 0
      ? "Hold straight"
      : absAngle <= 15
        ? "Slight"
        : absAngle <= 30
          ? "Moderate"
          : "Hard";

  const label =
    direction === "CENTER" ? "Hold wheel straight" : `${amount} ${direction}`;

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#e0f2fe",
        borderWidth: 1,
        borderColor: "#38bdf8",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: "900",
          color: "#0369a1",
        }}
      >
        STEERING AMOUNT
      </Text>

      <Text
        style={{
          marginTop: 6,
          textAlign: "center",
          fontSize: 20,
          fontWeight: "900",
          color: "#0f172a",
        }}
      >
        {label}
      </Text>

      <View
        style={{
          marginTop: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: "#bae6fd",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${Math.min(absAngle / 45, 1) * 100}%`,
            height: "100%",
            borderRadius: 999,
            backgroundColor:
              absAngle === 0
                ? "#22c55e"
                : absAngle <= 30
                  ? "#f97316"
                  : "#dc2626",
          }}
        />
      </View>
    </View>
  );
}
