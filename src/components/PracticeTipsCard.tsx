import { Text, View } from "react-native";
import { PracticeSession } from "./PracticeHistoryCard";

type Props = {
  sessions: PracticeSession[];
};

export function PracticeTipsCard({ sessions }: Props) {
  if (sessions.length === 0) {
    return null;
  }

  const latest = sessions[0];

  let title = "Keep building consistency";
  let message = "Focus on slow movement, mirror checks, and early corrections.";
  let goal = "Goal: improve your average score by 5 points.";
  let color = "#0e7490";
  let backgroundColor = "#ecfeff";
  let borderColor = "#67e8f9";

  if (latest.stats.autoStops > 0 && latest.stats.recoveryCompletions > 0) {
    title = "Good recovery — now prevent it earlier";
    message =
      "You recovered safely after an auto-stop. Next time, straighten earlier or pull forward before the trailer reaches the danger angle.";
    goal = "Goal: complete the next run with 0 auto-stops.";
    color = "#15803d";
    backgroundColor = "#dcfce7";
    borderColor = "#22c55e";
  } else if (latest.stats.autoStops > 0) {
    title = "Pull forward sooner";
    message =
      "The latest run triggered an auto-stop. When the trailer angle starts increasing quickly, stop and pull forward sooner.";
    goal = "Goal: use one early pull-forward correction before auto-stop.";
    color = "#dc2626";
    backgroundColor = "#fee2e2";
    borderColor = "#ef4444";
  } else if (latest.stats.steeringCorrections > 8) {
    title = "Use smaller steering corrections";
    message =
      "The latest run had several steering corrections. Small, slow inputs usually keep the trailer more predictable.";
    goal = "Goal: keep steering corrections under 7 next run.";
    color = "#ca8a04";
    backgroundColor = "#fefce8";
    borderColor = "#fde047";
  } else if (latest.stats.pullForwards > 3) {
    title = "Improve your starting setup";
    message =
      "You used several pull-forward corrections. Pulling forward is safe, but a straighter setup before backing can reduce corrections.";
    goal = "Goal: use 3 or fewer pull-forward corrections next run.";
    color = "#ea580c";
    backgroundColor = "#fff7ed";
    borderColor = "#fdba74";
  } else if (latest.stats.autoStops === 0) {
    title = "Controlled backing";
    message =
      "Your latest run had no auto-stops. Keep checking mirrors and straighten before the trailer angle grows.";
    goal = "Goal: repeat this on Normal or Tight difficulty.";
    color = "#16a34a";
    backgroundColor = "#f0fdf4";
    borderColor = "#86efac";
  }

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        backgroundColor,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Best Practice Tip
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 17,
          fontWeight: "900",
          color,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          fontWeight: "700",
          color: "#334155",
          lineHeight: 18,
        }}
      >
        {message}
      </Text>

      <View
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 12,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "900",
            color: "#0f172a",
            textAlign: "center",
            lineHeight: 18,
          }}
        >
          {goal}
        </Text>
      </View>
    </View>
  );
}
