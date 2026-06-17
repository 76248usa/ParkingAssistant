import { Text, View } from "react-native";

type Props = {
  steeringAngle: number;
  label: string;
};

export function SteeringWheel({ steeringAngle, label }: Props) {
  return (
    <View
      style={{
        marginTop: 8,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 4,
        }}
      >
        Steering Wheel
      </Text>

      <View
        style={{
          width: 82,
          height: 82,
          borderRadius: 41,
          borderWidth: 8,
          borderColor: "#0f172a",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate: `${steeringAngle}deg` }],
          backgroundColor: "#f8fafc",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 8,
            height: 34,
            borderRadius: 999,
            backgroundColor: "#0f172a",
            top: 8,
          }}
        />

        <View
          style={{
            position: "absolute",
            width: 48,
            height: 6,
            borderRadius: 999,
            backgroundColor: "#0f172a",
          }}
        />

        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: "#0f172a",
          }}
        />
      </View>

      <Text
        style={{
          marginTop: 4,
          fontSize: 13,
          fontWeight: "900",
          color: "#0f172a",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
