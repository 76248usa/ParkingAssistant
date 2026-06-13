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
  jackknifeAutoStopActive?: boolean;
  isRecoveringFromJackknife?: boolean;
};

function getJackknifeLimit(scenario: Scenario) {
  if (scenario === "easy") return 38;
  if (scenario === "tight") return 28;
  return 32;
}

function getSuggestedStep({
  practiceAction,
  simulatedSteeringAngle,
  simulatedTrailerAngle,
  scenario,
  stepIndex,
  backingSide,
  jackknifeAutoStopActive,
  isRecoveringFromJackknife,
}: Props) {
  const absTrailerAngle = Math.abs(simulatedTrailerAngle);
  const absSteeringAngle = Math.abs(simulatedSteeringAngle);
  const jackknifeLimit = getJackknifeLimit(scenario);

  if (jackknifeAutoStopActive) {
    return {
      title: "Pull forward slowly",
      message:
        "Jackknife prevention is active. Do not back up. Pull forward until the trailer angle is safer.",
      color: "#dc2626",
      backgroundColor: "#fee2e2",
      borderColor: "#ef4444",
    };
  }

  if (isRecoveringFromJackknife && absTrailerAngle >= 12) {
    return {
      title: "Keep pulling forward",
      message:
        "Continue pulling forward slowly until the trailer angle drops closer to straight.",
      color: "#ea580c",
      backgroundColor: "#fff7ed",
      borderColor: "#fdba74",
    };
  }

  if (isRecoveringFromJackknife && absTrailerAngle < 12) {
    return {
      title: "Straighten and resume",
      message:
        "Trailer angle is safer now. Straighten the wheel, check both mirrors, then resume backing slowly.",
      color: "#15803d",
      backgroundColor: "#dcfce7",
      borderColor: "#22c55e",
    };
  }

  if (practiceAction === "stop") {
    return {
      title: "Check before moving",
      message:
        "You are stopped. Check both mirrors, trailer angle, campsite obstacles, and clearance before moving again.",
      color: "#334155",
      backgroundColor: "#f8fafc",
      borderColor: "#cbd5e1",
    };
  }

  if (absTrailerAngle >= jackknifeLimit) {
    return {
      title: "Pull forward now",
      message:
        "Trailer angle is too sharp. Pull forward to reduce the angle before backing again.",
      color: "#dc2626",
      backgroundColor: "#fee2e2",
      borderColor: "#ef4444",
    };
  }

  if (absTrailerAngle >= jackknifeLimit - 6) {
    return {
      title: "Stop and correct",
      message:
        "Trailer angle is getting close to the danger zone. Stop, straighten slightly, and consider pulling forward.",
      color: "#ea580c",
      backgroundColor: "#fff7ed",
      borderColor: "#fdba74",
    };
  }

  if (absSteeringAngle >= 35 && practiceAction === "backing") {
    return {
      title: "Reduce steering",
      message:
        "The wheel is turned sharply while backing. Use smaller corrections to avoid over-angling the trailer.",
      color: "#ca8a04",
      backgroundColor: "#fefce8",
      borderColor: "#fde047",
    };
  }

  if (stepIndex === 0) {
    return {
      title: "Back up slowly",
      message:
        "Keep the wheel mostly straight and begin backing slowly while watching both mirrors.",
      color: "#0e7490",
      backgroundColor: "#ecfeff",
      borderColor: "#67e8f9",
    };
  }

  if (stepIndex === 1) {
    return {
      title:
        backingSide === "left" ? "Steer left gently" : "Steer right gently",
      message:
        backingSide === "left"
          ? "Begin turning the trailer toward the driver's side. Use small steering corrections."
          : "Begin turning the trailer toward the passenger side. Use small steering corrections.",
      color: "#2563eb",
      backgroundColor: "#eff6ff",
      borderColor: "#93c5fd",
    };
  }

  if (stepIndex === 2) {
    return {
      title:
        backingSide === "left"
          ? "Follow with right steering"
          : "Follow with left steering",
      message:
        "Follow the trailer as it enters the site. Watch the trailer angle and avoid letting it get too sharp.",
      color: "#7c3aed",
      backgroundColor: "#f5f3ff",
      borderColor: "#c4b5fd",
    };
  }

  if (stepIndex === 3) {
    return {
      title: "Straighten the wheel",
      message:
        "Start straightening the truck and trailer. Small corrections are better than big steering changes.",
      color: "#15803d",
      backgroundColor: "#dcfce7",
      borderColor: "#22c55e",
    };
  }

  return {
    title: "Stop and verify",
    message:
      "Stop and check clearance, trailer position, hookups, and campsite obstacles before finishing.",
    color: "#334155",
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
  };
}

export function AutoStepSuggestionCard({
  practiceAction,
  simulatedSteeringAngle,
  simulatedTruckAngle,
  simulatedTrailerAngle,
  scenario,
  stepIndex,
  backingSide,
  jackknifeAutoStopActive = false,
  isRecoveringFromJackknife = false,
}: Props) {
  const suggestion = getSuggestedStep({
    practiceAction,
    simulatedSteeringAngle,
    simulatedTruckAngle,
    simulatedTrailerAngle,
    scenario,
    stepIndex,
    backingSide,
    jackknifeAutoStopActive,
    isRecoveringFromJackknife,
  });

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        backgroundColor: suggestion.backgroundColor,
        borderWidth: 1,
        borderColor: suggestion.borderColor,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: suggestion.color,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        Suggested Next Step
      </Text>

      <Text
        style={{
          marginTop: 5,
          fontSize: 16,
          fontWeight: "900",
          color: suggestion.color,
        }}
      >
        {suggestion.title}
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
        {suggestion.message}
      </Text>
    </View>
  );
}
