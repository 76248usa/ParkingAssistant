import { Text, View } from "react-native";

type Props = {
  stepIndex: number;
  totalSteps: number;
  steeringAngle: number;
  truckAngle: number;
  trailerAngle: number;
};

export function TrainingScoreCard({
  stepIndex,
  totalSteps,
  steeringAngle,
  truckAngle,
  trailerAngle,
}: Props) {
  const hitchAngle = Math.abs(trailerAngle - truckAngle);

  const steeringScore = Math.max(70, 100 - Math.abs(steeringAngle));
  const hitchScore = Math.max(60, 100 - hitchAngle * 1.5);
  const progressScore = Math.round(((stepIndex + 1) / totalSteps) * 100);

  const totalScore = Math.round(
    steeringScore * 0.35 + hitchScore * 0.45 + progressScore * 0.2,
  );

  const rating =
    totalScore >= 90
      ? "Excellent"
      : totalScore >= 80
        ? "Good"
        : totalScore >= 70
          ? "Needs practice"
          : "High risk";

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#fefce8",
        borderWidth: 1,
        borderColor: "#facc15",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: "900",
          color: "#854d0e",
        }}
      >
        TRAINING SCORE
      </Text>

      <Text
        style={{
          marginTop: 6,
          textAlign: "center",
          fontSize: 28,
          fontWeight: "900",
          color: "#0f172a",
        }}
      >
        {totalScore}/100
      </Text>

      <Text
        style={{
          marginTop: 4,
          textAlign: "center",
          fontSize: 16,
          fontWeight: "900",
          color: "#854d0e",
        }}
      >
        {rating}
      </Text>

      <Text style={{ marginTop: 8, color: "#334155", fontWeight: "700" }}>
        Steering: {Math.round(steeringScore)}
      </Text>
      <Text style={{ color: "#334155", fontWeight: "700" }}>
        Hitch control: {Math.round(hitchScore)}
      </Text>
      <Text style={{ color: "#334155", fontWeight: "700" }}>
        Progress: {progressScore}
      </Text>
    </View>
  );
}
