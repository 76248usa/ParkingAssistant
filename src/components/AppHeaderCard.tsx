import { Text, View } from "react-native";

type Props = {
  totalLength: number;
};

export function AppHeaderCard({ totalLength }: Props) {
  return (
    <View
      style={{
        marginBottom: 4,
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
              fontSize: 26,
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            RV Parking Assist
          </Text>

          <Text
            style={{
              marginTop: 2,
              fontSize: 12,
              fontWeight: "800",
              color: "#64748b",
            }}
          >
            Step-by-step visual coaching for RV backing practice
          </Text>
        </View>

        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 999,
            backgroundColor: "#e0f2fe",
            borderWidth: 1,
            borderColor: "#7dd3fc",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "900",
              color: "#0369a1",
              textAlign: "center",
            }}
          >
            v1.0
          </Text>

          <Text
            style={{
              marginTop: 2,
              fontSize: 11,
              fontWeight: "800",
              color: "#0369a1",
              textAlign: "center",
            }}
          >
            Rig {totalLength} ft
          </Text>
        </View>
      </View>
    </View>
  );
}
