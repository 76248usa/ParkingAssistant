import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";

type Props = {
  steeringAngle: number;
  label: string;
};

export function SteeringWheel({ steeringAngle, label }: Props) {
  const animatedRotation = useRef(new Animated.Value(steeringAngle)).current;

  useEffect(() => {
    Animated.timing(animatedRotation, {
      toValue: steeringAngle,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [steeringAngle, animatedRotation]);

  const rotation = animatedRotation.interpolate({
    inputRange: [-90, 90],
    outputRange: ["-90deg", "90deg"],
  });

  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 14,
      }}
    >
      <Animated.View
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          borderWidth: 8,
          borderColor: "#0f172a",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          transform: [{ rotate: rotation }],
        }}
      >
        {/* Vertical spoke */}
        <View
          style={{
            width: 8,
            height: 70,
            backgroundColor: "#0f172a",
            borderRadius: 999,
            position: "absolute",
          }}
        />

        {/* Horizontal spoke */}
        <View
          style={{
            width: 65,
            height: 8,
            backgroundColor: "#0f172a",
            borderRadius: 999,
            position: "absolute",
          }}
        />

        {/* Center hub */}
        <Text
          style={{
            fontSize: 24,
          }}
        >
          ●
        </Text>
      </Animated.View>

      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: "900",
          color: "#0f172a",
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          color: "#64748b",
        }}
      >
        {steeringAngle}°
      </Text>
    </View>
  );
}
