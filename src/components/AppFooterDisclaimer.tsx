import { Text, View } from "react-native";

export function AppFooterDisclaimer() {
  return (
    <View
      style={{
        marginTop: 18,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: "#cbd5e1",
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: "#64748b",
          textAlign: "center",
          lineHeight: 16,
        }}
      >
        RV Assist v1.0 is a visual coaching aid only. Always use mirrors,
        cameras, spotters, and direct visual checks before moving your RV.
      </Text>
    </View>
  );
}
