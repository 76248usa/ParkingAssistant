import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";

type Props = {
  stepIndex: number;
  backingSide: "left" | "right";
};

export function ParkingDiagram({ stepIndex, backingSide }: Props) {
  const sideMultiplier = backingSide === "left" ? 1 : -1;

  const baseTrailerAngle =
    stepIndex === 1 ? 22 : stepIndex === 2 ? -18 : stepIndex === 3 ? 6 : 0;

  const trailerAngle = baseTrailerAngle * sideMultiplier;

  const animatedTrailerAngle = useRef(new Animated.Value(trailerAngle)).current;

  useEffect(() => {
    Animated.timing(animatedTrailerAngle, {
      toValue: trailerAngle,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [trailerAngle, animatedTrailerAngle]);

  const trailerRotation = animatedTrailerAngle.interpolate({
    inputRange: [-45, 45],
    outputRange: ["-45deg", "45deg"],
  });

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

      <Animated.View
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
            { translateX: 45 },
            { rotate: trailerRotation },
            { translateX: -45 },
          ],
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
          Trailer
        </Text>
      </Animated.View>

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
          top: 8,
          left: 12,
          color: "#0f172a",
          fontSize: 12,
          fontWeight: "900",
        }}
      >
        {backingSide === "left" ? "Left-side back-in" : "Right-side back-in"}
      </Text>

      <Text
        style={{
          position: "absolute",
          bottom: 8,
          color: "#64748b",
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        Trailer angle: {trailerAngle}°
      </Text>
    </View>
  );
}
