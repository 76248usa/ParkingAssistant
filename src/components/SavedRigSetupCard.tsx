import { Text, TouchableOpacity, View } from "react-native";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  truckLength: string;
  trailerLength: string;
  totalLength: number;
  backingSide: "left" | "right";
  scenario: Scenario;
  onEditSetup: () => void;
};

function getBackingSideLabel(backingSide: "left" | "right") {
  return backingSide === "left" ? "Left-side" : "Right-side";
}

function getScenarioLabel(scenario: Scenario) {
  if (scenario === "easy") return "Easy";
  if (scenario === "tight") return "Tight";
  return "Normal";
}

export function SavedRigSetupCard({
  truckLength,
  trailerLength,
  totalLength,
  backingSide,
  scenario,
  onEditSetup,
}: Props) {
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "900",
              color: "#334155",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Saved Rig Setup
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 15,
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            Rig: {truckLength || "—"} ft truck + {trailerLength || "—"} ft
            trailer = {totalLength || "—"} ft
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              fontWeight: "800",
              color: "#64748b",
            }}
          >
            {getBackingSideLabel(backingSide)} backing •
            {getScenarioLabel(scenario)} difficulty
          </Text>
        </View>

        <TouchableOpacity
          onPress={onEditSetup}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: "#0f172a",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 12,
              fontWeight: "900",
            }}
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
