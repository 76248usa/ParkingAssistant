import { Text, View } from "react-native";

type Props = {
  stepIndex: number;
};

export function ParkingDiagram({ stepIndex }: Props) {
  return (
    <View
      style={{
        marginTop: 20,
        height: 180,
        borderRadius: 16,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#cbd5e1",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          right: 24,
          top: 18,
          width: 110,
          height: 145,
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderBottomWidth: 4,
          borderColor: "#94a3b8",
          borderStyle: "dashed",
          borderRadius: 10,
        }}
      />

      <View
        style={{
          position: "absolute",
          left: 48,
          width: 90,
          height: 44,
          borderRadius: 10,
          backgroundColor: "#0e7490",
          justifyContent: "center",
          alignItems: "center",
          transform: [
            {
              rotate:
                stepIndex === 1 ? "20deg" : stepIndex === 2 ? "-15deg" : "0deg",
            },
          ],
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
          Trailer
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          left: 138,
          width: 35,
          height: 6,
          borderRadius: 999,
          backgroundColor: "#64748b",
        }}
      />

      <View
        style={{
          position: "absolute",
          left: 170,
          width: 80,
          height: 50,
          borderRadius: 12,
          backgroundColor: "#1e293b",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
          Truck
        </Text>
      </View>

      <Text
        style={{
          position: "absolute",
          bottom: 8,
          color: "#64748b",
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        Simplified parking view
      </Text>
    </View>
  );
}
