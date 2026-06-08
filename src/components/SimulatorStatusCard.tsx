import { Text, View } from "react-native";
import { PracticeAction } from "./PracticeModeControls";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  practiceAction: PracticeAction;
  simulatedSteeringAngle: number;
  simulatedTruckAngle: number;
  simulatedTrailerAngle: number;
  scenario: Scenario;
};

function formatAngle(angle: number) {
  const rounded = Math.round(angle);

  if (rounded > 0) return `${rounded}° right`;
  if (rounded < 0) return `${Math.abs(rounded)}° left`;
  return "0° straight";
}

function getMotionLabel(practiceAction: PracticeAction) {
  if (practiceAction === "backing") return "Backing";
  if (practiceAction === "forward") return "Pulling forward";
  if (practiceAction === "steerLeft") return "Steering left";
  if (practiceAction === "steerRight") return "Steering right";
  if (practiceAction === "stop") return "Stopped";
  return "Idle";
}

function getJackknifeRisk(
  trailerAngle: number,
  scenario: Scenario,
): {
  label: string;
  color: string;
  note: string;
} {
  const angle = Math.abs(trailerAngle);

  const highLimit = scenario === "tight" ? 28 : scenario === "easy" ? 38 : 32;
  const mediumLimit = scenario === "tight" ? 18 : scenario === "easy" ? 26 : 22;

  if (angle >= highLimit) {
    return {
      label: "High",
      color: "#dc2626",
      note: "Pull forward or straighten before backing farther.",
    };
  }

  if (angle >= mediumLimit) {
    return {
      label: "Moderate",
      color: "#f97316",
      note: "Use smaller corrections and monitor trailer angle.",
    };
  }

  return {
    label: "Low",
    color: "#16a34a",
    note: "Trailer angle is within a controlled range.",
  };
}

export function SimulatorStatusCard({
  practiceAction,
  simulatedSteeringAngle,
  simulatedTruckAngle,
  simulatedTrailerAngle,
  scenario,
}: Props) {
  const motionLabel = getMotionLabel(practiceAction);
  const jackknifeRisk = getJackknifeRisk(simulatedTrailerAngle, scenario);

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#cbd5e1",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "900",
          color: "#0f172a",
          marginBottom: 8,
        }}
      >
        Simulator Status
      </Text>

      <View
        style={{
          gap: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#475569" }}>
            Motion
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "900", color: "#0f172a" }}>
            {motionLabel}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#475569" }}>
            Steering
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "900", color: "#0f172a" }}>
            {formatAngle(simulatedSteeringAngle)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#475569" }}>
            Truck angle
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "900", color: "#0f172a" }}>
            {formatAngle(simulatedTruckAngle)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#475569" }}>
            Trailer angle
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "900", color: "#0f172a" }}>
            {formatAngle(simulatedTrailerAngle)}
          </Text>
        </View>

        <View
          style={{
            marginTop: 4,
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
              color: jackknifeRisk.color,
            }}
          >
            Jackknife Risk: {jackknifeRisk.label}
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 12,
              fontWeight: "600",
              color: "#475569",
              lineHeight: 17,
            }}
          >
            {jackknifeRisk.note}
          </Text>
        </View>
      </View>
    </View>
  );
}
