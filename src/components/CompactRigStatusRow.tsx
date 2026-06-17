import { Text, View } from "react-native";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  steeringAngle: number;
  truckAngle: number;
  trailerAngle: number;
  scenario: Scenario;
};

function getSteeringLabel(steeringAngle: number) {
  if (steeringAngle > 8) return "Right";
  if (steeringAngle < -8) return "Left";
  return "Straight";
}

function getHitchAngle(truckAngle: number, trailerAngle: number) {
  return Math.abs(trailerAngle - truckAngle);
}

function getHitchStatus(hitchAngle: number, scenario: Scenario) {
  const cautionLimit =
    scenario === "tight" ? 18 : scenario === "easy" ? 28 : 23;
  const dangerLimit = scenario === "tight" ? 28 : scenario === "easy" ? 40 : 34;

  if (hitchAngle >= dangerLimit) {
    return {
      label: "Danger",
      emoji: "🔴",
      color: "#991b1b",
      backgroundColor: "#fee2e2",
      borderColor: "#fca5a5",
    };
  }

  if (hitchAngle >= cautionLimit) {
    return {
      label: "Caution",
      emoji: "🟠",
      color: "#c2410c",
      backgroundColor: "#fff7ed",
      borderColor: "#fdba74",
    };
  }

  return {
    label: "Safe",
    emoji: "🟢",
    color: "#166534",
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  };
}

export function CompactRigStatusRow({
  steeringAngle,
  truckAngle,
  trailerAngle,
  scenario,
}: Props) {
  const steeringLabel = getSteeringLabel(steeringAngle);
  const hitchAngle = getHitchAngle(truckAngle, trailerAngle);
  const hitchStatus = getHitchStatus(hitchAngle, scenario);

  return (
    <View
      style={{
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: hitchStatus.backgroundColor,
        borderWidth: 1,
        borderColor: hitchStatus.borderColor,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 12,
          fontWeight: "900",
          color: "#0f172a",
        }}
        numberOfLines={1}
      >
        Steering: {steeringLabel} {Math.round(steeringAngle)}°
      </Text>

      <Text
        style={{
          flex: 1,
          fontSize: 12,
          fontWeight: "900",
          color: hitchStatus.color,
          textAlign: "right",
        }}
        numberOfLines={1}
      >
        {hitchStatus.emoji} Hitch: {hitchStatus.label} {Math.round(hitchAngle)}°
      </Text>
    </View>
  );
}
