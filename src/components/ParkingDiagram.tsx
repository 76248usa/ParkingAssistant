import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { SiteObstacle } from "./SiteObstacleSelector";

type Props = {
  stepIndex: number;
  backingSide: "left" | "right";
  obstacles: SiteObstacle[];
};

export function ParkingDiagram({ stepIndex, backingSide, obstacles }: Props) {
  const sideMultiplier = backingSide === "left" ? 1 : -1;

  const baseTrailerAngle =
    stepIndex === 1 ? 22 : stepIndex === 2 ? -18 : stepIndex === 3 ? 6 : 0;

  const baseTruckAngle =
    stepIndex === 1 ? -10 : stepIndex === 2 ? 12 : stepIndex === 3 ? 4 : 0;

  const trailerAngle = baseTrailerAngle * sideMultiplier;
  const truckAngle = baseTruckAngle * sideMultiplier;

  const animatedTrailerAngle = useRef(new Animated.Value(trailerAngle)).current;
  const animatedTruckAngle = useRef(new Animated.Value(truckAngle)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedTrailerAngle, {
        toValue: trailerAngle,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(animatedTruckAngle, {
        toValue: truckAngle,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [trailerAngle, truckAngle, animatedTrailerAngle, animatedTruckAngle]);

  const trailerRotation = animatedTrailerAngle.interpolate({
    inputRange: [-45, 45],
    outputRange: ["-45deg", "45deg"],
  });

  const truckRotation = animatedTruckAngle.interpolate({
    inputRange: [-25, 25],
    outputRange: ["-25deg", "25deg"],
  });

  return (
    <View
      style={{
        height: 220,
        backgroundColor: "#e5e7eb",
        borderRadius: 16,
        marginTop: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Parking space */}
      <View
        style={{
          position: "absolute",
          right: 24,
          top: 22,
          width: 110,
          height: 155,
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderBottomWidth: 4,
          borderColor: "#94a3b8",
          borderStyle: "dashed",
          borderRadius: 10,
        }}
      />

      {/* Obstacle icons */}
      {obstacles.includes("treeLeft") && (
        <Text
          style={{
            position: "absolute",
            left: 10,
            top: 80,
            fontSize: 28,
            zIndex: 5,
          }}
        >
          🌳
        </Text>
      )}

      {obstacles.includes("poleRight") && (
        <Text
          style={{
            position: "absolute",
            right: 10,
            top: 80,
            fontSize: 28,
            zIndex: 5,
          }}
        >
          🚧
        </Text>
      )}

      {obstacles.includes("lowBranch") && (
        <Text
          style={{
            position: "absolute",
            top: 8,
            alignSelf: "center",
            fontSize: 28,
            zIndex: 5,
          }}
        >
          🌿
        </Text>
      )}

      {obstacles.includes("tightHookupSide") && (
        <Text
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            fontSize: 28,
            zIndex: 5,
          }}
        >
          ⚡
        </Text>
      )}

      {/* Predicted trailer path */}
      <View
        style={{
          position: "absolute",
          left: backingSide === "left" ? 68 : 92,
          top: 118,
          width: 155,
          height: 4,
          borderRadius: 999,
          backgroundColor: "#f97316",
          opacity: 0.85,
          transform: [
            {
              rotate:
                stepIndex === 1
                  ? `${28 * sideMultiplier}deg`
                  : stepIndex === 2
                    ? `${-20 * sideMultiplier}deg`
                    : stepIndex === 3
                      ? `${8 * sideMultiplier}deg`
                      : "0deg",
            },
          ],
        }}
      />

      <View
        style={{
          position: "absolute",
          left: backingSide === "left" ? 188 : 60,
          top: 112,
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#f97316",
          opacity: 0.9,
        }}
      />

      <Text
        style={{
          position: "absolute",
          top: 38,
          right: 34,
          color: "#64748b",
          fontSize: 10,
          fontWeight: "900",
        }}
      >
        PARKING SPACE
      </Text>

      {/* Trailer */}
      <Animated.View
        style={{
          position: "absolute",
          left: 48,
          top: 126,
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

      {/* Hitch */}
      <Animated.View
        style={{
          position: "absolute",
          left: 136,
          top: 145,
          width: 42,
          height: 6,
          borderRadius: 999,
          backgroundColor: "#64748b",
          transform: [{ rotate: truckRotation }],
        }}
      />

      {/* Truck */}
      <Animated.View
        style={{
          position: "absolute",
          left: 170,
          top: 124,
          width: 80,
          height: 50,
          borderRadius: 12,
          backgroundColor: "#1e293b",
          justifyContent: "center",
          alignItems: "center",
          transform: [{ rotate: truckRotation }],
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
          Truck
        </Text>
      </Animated.View>

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
          bottom: 24,
          left: 12,
          color: "#f97316",
          fontSize: 12,
          fontWeight: "900",
        }}
      >
        Predicted trailer path
      </Text>

      <Text
        style={{
          position: "absolute",
          bottom: 8,
          left: 12,
          color: "#64748b",
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        Truck: {truckAngle}° | Trailer: {trailerAngle}°
      </Text>
    </View>
  );
}
