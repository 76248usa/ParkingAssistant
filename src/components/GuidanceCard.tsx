"use client";

import { Text, TouchableOpacity, View } from "react-native";
import { GuidanceStep } from "../constants/parkingGuidance";
import { ParkingDiagram } from "./ParkingDiagram";
import { SteeringWheel } from "./SteeringWheel";
// Keep this commented out until we fix layout/scrolling.
// import { ParkingDiagram } from "./ParkingDiagram";

type Props = {
  currentStep: GuidanceStep;
  stepIndex: number;
  totalSteps: number;
  goBack: () => void;
  goNext: () => void;
};

export function GuidanceCard({
  currentStep,
  stepIndex,
  totalSteps,
  goBack,
  goNext,
}: Props) {
  const steeringGuidance =
    stepIndex === 0
      ? "↑ KEEP STRAIGHT"
      : stepIndex === 1
        ? "↶ TURN LEFT"
        : stepIndex === 2
          ? "↷ TURN RIGHT"
          : stepIndex === 3
            ? "↑ STRAIGHTEN WHEEL"
            : "🛑 STOP";

  const steeringAngle = stepIndex === 1 ? -35 : stepIndex === 2 ? 35 : 0;

  const steeringLabel =
    stepIndex === 1
      ? "Turn Left"
      : stepIndex === 2
        ? "Turn Right"
        : stepIndex === 3
          ? "Straighten"
          : stepIndex >= 4
            ? "Stop"
            : "Straight";

  const bannerColor = steeringGuidance === "🛑 STOP" ? "#dc2626" : "#0891b2";

  return (
    <View
      style={{
        marginTop: 18,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#ecfeff",
        borderWidth: 1,
        borderColor: "#67e8f9",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "bold",
          color: "#0e7490",
        }}
      >
        STEP {stepIndex + 1} OF {totalSteps}
      </Text>

      <View
        style={{
          marginTop: 12,
          backgroundColor: bannerColor,
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 24,
            fontWeight: "900",
          }}
        >
          {steeringGuidance}
        </Text>
      </View>

      <SteeringWheel steeringAngle={steeringAngle} label={steeringLabel} />

      <Text
        style={{
          marginTop: 12,
          fontSize: 22,
          fontWeight: "bold",
          color: "#0f172a",
        }}
      >
        {currentStep.title}
      </Text>

      <Text
        style={{
          marginTop: 10,
          fontSize: 16,
          lineHeight: 23,
        }}
      >
        {currentStep.instruction}
      </Text>

      {currentStep.warning ? (
        <View
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            backgroundColor: "#fff7ed",
            borderWidth: 1,
            borderColor: "#fed7aa",
          }}
        >
          <Text
            style={{
              color: "#9a3412",
              fontWeight: "bold",
            }}
          >
            ⚠️ {currentStep.warning}
          </Text>
        </View>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginTop: 18,
        }}
      >
        <TouchableOpacity
          onPress={goBack}
          disabled={stepIndex === 0}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            backgroundColor: stepIndex === 0 ? "#f1f5f9" : "white",
            opacity: stepIndex === 0 ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goNext}
          disabled={stepIndex === totalSteps - 1}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            backgroundColor:
              stepIndex === totalSteps - 1 ? "#94a3b8" : "#0891b2",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {stepIndex === totalSteps - 1 ? "Done" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Re-enable later after layout/scrolling is fixed */}
      <ParkingDiagram stepIndex={stepIndex} />
    </View>
  );
}
