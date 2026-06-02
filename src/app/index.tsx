"use client";

import React, { useState } from "react";
import { Text, View } from "react-native";
import { GuidanceCard } from "../components/GuidanceCard";
import { ParkingTypeSelector } from "../components/ParkingTypeSelector";
import { RigSetupCard } from "../components/RigSetupCard";
import { ParkingType, guidanceByType } from "../constants/parkingGuidance";

export default function Index() {
  const [truckLength, setTruckLength] = useState("20");
  const [trailerLength, setTrailerLength] = useState("30");
  const [parkingType, setParkingType] = useState<ParkingType>("back-in");
  const [stepIndex, setStepIndex] = useState(0);
  const [backingSide, setBackingSide] = useState<"left" | "right">("left");
  const totalLength = (Number(truckLength) || 0) + (Number(trailerLength) || 0);

  const steps = guidanceByType[parkingType];
  const currentStep = steps[stepIndex];

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

  const bannerColor = steeringGuidance === "🛑 STOP" ? "#dc2626" : "#0891b2";

  function selectParkingType(type: ParkingType) {
    setParkingType(type);
    setStepIndex(0);
  }

  function goBack() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function goNext() {
    setStepIndex((current) => Math.min(steps.length - 1, current + 1));
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        backgroundColor: "#f8fafc",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        RV Parking Assistant
      </Text>

      <GuidanceCard
        currentStep={currentStep}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        backingSide={backingSide}
        setBackingSide={setBackingSide}
        goBack={goBack}
        goNext={goNext}
      />

      <View
        style={{
          marginTop: 14,
          backgroundColor: bannerColor,
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 26,
            fontWeight: "900",
          }}
        >
          {steeringGuidance}
        </Text>
      </View>

      <RigSetupCard
        truckLength={truckLength}
        trailerLength={trailerLength}
        totalLength={totalLength}
        setTruckLength={setTruckLength}
        setTrailerLength={setTrailerLength}
      />

      <ParkingTypeSelector
        parkingType={parkingType}
        selectParkingType={selectParkingType}
      />
    </View>
  );
}
