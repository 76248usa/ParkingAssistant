import { Text, TouchableOpacity, View } from "react-native";

export type PracticeAction =
  | "idle"
  | "backing"
  | "forward"
  | "steerLeft"
  | "steerRight"
  | "stop";

type Props = {
  practiceAction: PracticeAction;
  onPracticeAction: (action: PracticeAction) => void;
  onResetSimulation: () => void;
  backingSide: "left" | "right";
};

function getActionMessage(
  practiceAction: PracticeAction,
  backingSide: "left" | "right",
) {
  if (practiceAction === "backing") {
    return "Backing slowly. Trailer angle changes based on your current steering angle and momentum.";
  }

  if (practiceAction === "forward") {
    return "Pulling forward to reduce the angle and reset the approach.";
  }

  if (practiceAction === "steerLeft") {
    return backingSide === "left"
      ? "Steering left. Trailer angle will increase toward the driver's side."
      : "Steering left. Watch the trailer swing and correct slowly.";
  }

  if (practiceAction === "steerRight") {
    return backingSide === "right"
      ? "Steering right. Trailer angle will increase toward the passenger side."
      : "Steering right. Watch the trailer swing and correct slowly.";
  }

  if (practiceAction === "stop") {
    return "Stopped. Check clearance, trailer angle, and campsite obstacles.";
  }

  return "Choose a practice action to simulate backing behavior.";
}

function getButtonStyle(selected: boolean, danger = false) {
  return {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: selected ? "#0f172a" : "#cbd5e1",
    backgroundColor: selected ? (danger ? "#dc2626" : "#0f172a") : "white",
  };
}

function getButtonTextStyle(selected: boolean) {
  return {
    textAlign: "center" as const,
    fontSize: 12,
    fontWeight: "900" as const,
    color: selected ? "white" : "#0f172a",
  };
}

export function PracticeModeControls({
  practiceAction,
  onPracticeAction,
  onResetSimulation,
  backingSide,
}: Props) {
  const actionMessage = getActionMessage(practiceAction, backingSide);

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
        Practice Mode Controls
      </Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          onPress={() => onPracticeAction("backing")}
          style={getButtonStyle(practiceAction === "backing")}
        >
          <Text style={getButtonTextStyle(practiceAction === "backing")}>
            ⬇️ Back up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onPracticeAction("forward")}
          style={getButtonStyle(practiceAction === "forward")}
        >
          <Text style={getButtonTextStyle(practiceAction === "forward")}>
            ⬆️ Pull forward
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        <TouchableOpacity
          onPress={() => onPracticeAction("steerLeft")}
          style={getButtonStyle(practiceAction === "steerLeft")}
        >
          <Text style={getButtonTextStyle(practiceAction === "steerLeft")}>
            ↶ Steer left
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onPracticeAction("steerRight")}
          style={getButtonStyle(practiceAction === "steerRight")}
        >
          <Text style={getButtonTextStyle(practiceAction === "steerRight")}>
            ↷ Steer right
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => onPracticeAction("stop")}
        style={{
          marginTop: 8,
          paddingVertical: 12,
          paddingHorizontal: 8,
          borderRadius: 12,
          backgroundColor: practiceAction === "stop" ? "#dc2626" : "#fee2e2",
          borderWidth: 1,
          borderColor: "#dc2626",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 13,
            fontWeight: "900",
            color: practiceAction === "stop" ? "white" : "#7f1d1d",
          }}
        >
          🛑 Stop
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onResetSimulation}
        style={{
          marginTop: 8,
          paddingVertical: 12,
          paddingHorizontal: 8,
          borderRadius: 12,
          backgroundColor: "#e0f2fe",
          borderWidth: 1,
          borderColor: "#0284c7",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 13,
            fontWeight: "900",
            color: "#075985",
          }}
        >
          🔄 Reset Simulation
        </Text>
      </TouchableOpacity>

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
            color: "#0e7490",
            fontSize: 13,
            fontWeight: "800",
            lineHeight: 18,
          }}
        >
          {actionMessage}
        </Text>
      </View>
    </View>
  );
}
