import { Text, View } from "react-native";
import { PracticeAction } from "./PracticeModeControls";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  practiceAction: PracticeAction;
  simulatedSteeringAngle: number;
  simulatedTruckAngle: number;
  simulatedTrailerAngle: number;
  scenario: Scenario;
  stepIndex: number;
  backingSide: "left" | "right";
};

function getJackknifeLimit(scenario: Scenario) {
  if (scenario === "easy") return 38;
  if (scenario === "tight") return 28;
  return 32;
}

function getSuggestedStep({
  practiceAction,
  simulatedSteeringAngle,
  simulatedTruckAngle,
  simulatedTrailerAngle,
  scenario,
  stepIndex,
  backingSide,
}: Props) {
  const absTrailerAngle = Math.abs(simulatedTrailerAngle);
  const absSteeringAngle = Math.abs(simulatedSteeringAngle);
  const jackknifeLimit = getJackknifeLimit(scenario);

  if (practiceAction === "stop") {
    return {
      title: "Suggested Next Step",
      action: "Check mirrors",
      message:
        "You are stopped. Check both mirrors, trailer angle, and obstacle clearance before moving again.",
      backgroundColor: "#f8fafc",
      borderColor: "#cbd5e1",
      textColor: "#0f172a",
    };
  }

  if (absTrailerAngle >= jackknifeLimit) {
    return {
      title: "Suggested Next Step",
      action: "⬆️ Pull forward",
      message:
        "Trailer angle is too sharp. Pull forward to reduce jackknife risk before backing again.",
      backgroundColor: "#fee2e2",
      borderColor: "#ef4444",
      textColor: "#7f1d1d",
    };
  }

  if (absTrailerAngle >= jackknifeLimit - 6) {
    return {
      title: "Suggested Next Step",
      action: "🛑 Stop and correct",
      message:
        "Trailer angle is getting close to the limit. Stop, straighten the wheel, then pull forward if needed.",
      backgroundColor: "#fff7ed",
      borderColor: "#fb923c",
      textColor: "#7c2d12",
    };
  }

  if (absSteeringAngle >= 35 && practiceAction === "backing") {
    return {
      title: "Suggested Next Step",
      action: "Reduce steering",
      message:
        "Steering input is too sharp while backing. Straighten the wheel slightly before continuing.",
      backgroundColor: "#fff7ed",
      borderColor: "#fb923c",
      textColor: "#7c2d12",
    };
  }

  if (stepIndex === 0) {
    return {
      title: "Suggested Next Step",
      action: "⬇️ Back up slowly",
      message:
        "Your setup is straight. Begin backing slowly and watch the trailer in both mirrors.",
      backgroundColor: "#dcfce7",
      borderColor: "#22c55e",
      textColor: "#14532d",
    };
  }

  if (stepIndex === 1) {
    return {
      title: "Suggested Next Step",
      action: backingSide === "left" ? "↶ Steer left" : "↷ Steer right",
      message:
        backingSide === "left"
          ? "Begin the trailer turn toward the driver side with a controlled left steering input."
          : "Begin the trailer turn toward the passenger side with a controlled right steering input.",
      backgroundColor: "#ecfeff",
      borderColor: "#06b6d4",
      textColor: "#155e75",
    };
  }

  if (stepIndex === 2) {
    return {
      title: "Suggested Next Step",
      action: backingSide === "left" ? "↷ Steer right" : "↶ Steer left",
      message:
        backingSide === "left"
          ? "Follow the trailer by steering right. Avoid letting the trailer angle grow too much."
          : "Follow the trailer by steering left. Avoid letting the trailer angle grow too much.",
      backgroundColor: "#ecfeff",
      borderColor: "#06b6d4",
      textColor: "#155e75",
    };
  }

  if (stepIndex === 3) {
    return {
      title: "Suggested Next Step",
      action: "Straighten wheel",
      message:
        "Straighten the wheel and back slowly. Keep the trailer angle small before entering the site.",
      backgroundColor: "#ede9fe",
      borderColor: "#8b5cf6",
      textColor: "#4c1d95",
    };
  }

  return {
    title: "Suggested Next Step",
    action: "🛑 Stop and verify",
    message:
      "Stop and verify clearance before final backing. Check both sides and overhead.",
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    textColor: "#0f172a",
  };
}

export function AutoStepSuggestionCard(props: Props) {
  const suggestion = getSuggestedStep(props);

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: suggestion.backgroundColor,
        borderWidth: 1,
        borderColor: suggestion.borderColor,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "900",
          color: suggestion.textColor,
          marginBottom: 4,
        }}
      >
        {suggestion.title}
      </Text>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "900",
          color: suggestion.textColor,
          marginBottom: 6,
        }}
      >
        {suggestion.action}
      </Text>

      <Text
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: suggestion.textColor,
          lineHeight: 18,
        }}
      >
        {suggestion.message}
      </Text>
    </View>
  );
}
