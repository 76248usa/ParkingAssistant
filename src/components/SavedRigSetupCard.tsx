import { Text, TouchableOpacity, View } from "react-native";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  truckLength: string;
  trailerLength: string;
  backingSide: "left" | "right";
  scenario: Scenario;
  onEditSetup: () => void;
};

function getBackingSideLabel(backingSide: "left" | "right") {
  return backingSide === "left" ? "Left-side back-in" : "Right-side back-in";
}

function getScenarioLabel(scenario: Scenario) {
  if (scenario === "easy") return "Easy";
  if (scenario === "tight") return "Tight";
  return "Normal";
}

export function SavedRigSetupCard({
  truckLength,
  trailerLength,
  backingSide,
  scenario,
  onEditSetup,
}: Props) {
  const truckLengthNumber = Number.parseFloat(truckLength);
  const trailerLengthNumber = Number.parseFloat(trailerLength);

  const totalRigLength =
    Number.isFinite(truckLengthNumber) && Number.isFinite(trailerLengthNumber)
      ? truckLengthNumber + trailerLengthNumber
      : null;

  return (
    <View
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#cbd5e1",
      }}
    >
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

      <View style={{ marginTop: 10, gap: 6 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", color: "#0f172a" }}>
          Truck length: {truckLength || "—"} ft
        </Text>

        <Text style={{ fontSize: 14, fontWeight: "800", color: "#0f172a" }}>
          Trailer length: {trailerLength || "—"} ft
        </Text>

        <Text style={{ fontSize: 14, fontWeight: "800", color: "#0f172a" }}>
          Total rig length: {totalRigLength != null ? totalRigLength : "—"} ft
        </Text>

        <Text style={{ fontSize: 14, fontWeight: "800", color: "#0f172a" }}>
          Backing side: {getBackingSideLabel(backingSide)}
        </Text>

        <Text style={{ fontSize: 14, fontWeight: "800", color: "#0f172a" }}>
          Difficulty: {getScenarioLabel(scenario)}
        </Text>
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 12,
          fontWeight: "700",
          color: "#64748b",
          lineHeight: 17,
        }}
      >
        These settings are saved on this device and used for your practice
        simulator.
      </Text>

      <TouchableOpacity
        onPress={onEditSetup}
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          backgroundColor: "#0f172a",
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 13,
            fontWeight: "900",
          }}
        >
          ✏️ Edit Rig Setup
        </Text>
      </TouchableOpacity>
    </View>
  );
}
