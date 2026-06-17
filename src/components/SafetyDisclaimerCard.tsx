import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function SafetyDisclaimerCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: "#fff7ed",
        borderWidth: 1,
        borderColor: "#fed7aa",
      }}
    >
      <TouchableOpacity
        onPress={() => setIsExpanded((current) => !current)}
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
              color: "#9a3412",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Safety Reminder
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              fontWeight: "800",
              color: "#7c2d12",
            }}
          >
            Training aid only — tap for details
          </Text>
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "900",
            color: "#9a3412",
          }}
        >
          {isExpanded ? "−" : "+"}
        </Text>
      </TouchableOpacity>

      {isExpanded ? (
        <Text
          style={{
            marginTop: 10,
            fontSize: 13,
            fontWeight: "800",
            color: "#7c2d12",
            lineHeight: 19,
          }}
        >
          RV Assist is a training aid only. Always use your mirrors, backup
          camera, spotter, and direct visual checks when backing an RV. Stop
          immediately if you are unsure about clearance, trailer angle, people,
          pets, or obstacles.
        </Text>
      ) : null}
    </View>
  );
}
