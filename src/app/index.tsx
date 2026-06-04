"use client";

import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { CollisionRiskCard } from "../components/CollisionRiskCard";
import { GuidanceCard } from "../components/GuidanceCard";
import { ParkingTypeSelector } from "../components/ParkingTypeSelector";
import { RigSetupCard } from "../components/RigSetupCard";
import {
  SiteObstacle,
  SiteObstacleSelector,
} from "../components/SiteObstacleSelector";
import { ParkingType, guidanceByType } from "../constants/parkingGuidance";
function getObstacleWarning(obstacles: SiteObstacle[], stepIndex: number) {
  const warnings: string[] = [];

  if (obstacles.includes("poleRight")) {
    if (stepIndex <= 1) {
      warnings.push(
        "🚧 Right-side pole: start wider and avoid cutting in too early.",
      );
    } else {
      warnings.push(
        "🚧 Right-side pole: watch trailer swing before straightening.",
      );
    }
  }

  if (obstacles.includes("treeLeft")) {
    if (stepIndex <= 1) {
      warnings.push("🌳 Tree on left: keep the trailer angle shallow.");
    } else {
      warnings.push("🌳 Tree on left: avoid drifting toward the driver side.");
    }
  }

  if (obstacles.includes("lowBranch")) {
    warnings.push("🌿 Low branch: check roof clearance before backing deeper.");
  }

  if (obstacles.includes("tightHookupSide")) {
    warnings.push(
      "⚡ Tight hookup side: leave extra room on the utility side.",
    );
  }

  return warnings;
}

export default function Index() {
  const [truckLength, setTruckLength] = useState("20");
  const [trailerLength, setTrailerLength] = useState("30");
  const [parkingType, setParkingType] = useState<ParkingType>("back-in");
  const [stepIndex, setStepIndex] = useState(0);
  const [backingSide, setBackingSide] = useState<"left" | "right">("left");
  const [scenario, setScenario] = useState<"easy" | "normal" | "tight">(
    "normal",
  );
  const [obstacles, setObstacles] = useState<SiteObstacle[]>([]);

  const totalLength = (Number(truckLength) || 0) + (Number(trailerLength) || 0);
  const steps = guidanceByType[parkingType];
  const currentStep = steps[stepIndex];

  const obstacleWarnings = getObstacleWarning(obstacles, stepIndex);

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

  function restartPractice() {
    setStepIndex(0);
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
      }}
      contentContainerStyle={{
        padding: 24,
        paddingBottom: 80,
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
        restartPractice={restartPractice}
        scenario={scenario}
        setScenario={setScenario}
        obstacles={obstacles}
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
      <CollisionRiskCard
        stepIndex={stepIndex}
        backingSide={backingSide}
        scenario={scenario}
        obstacles={obstacles}
      />
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
      <SiteObstacleSelector obstacles={obstacles} setObstacles={setObstacles} />
      {obstacleWarnings.length > 0 && (
        <View
          style={{
            backgroundColor: "#fff3cd",
            borderWidth: 1,
            borderColor: "#f0c36d",
            borderRadius: 12,
            padding: 12,
            marginVertical: 10,
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 6 }}>
            Obstacle Coaching
          </Text>

          {obstacleWarnings.map((warning) => (
            <Text key={warning} style={{ marginBottom: 4 }}>
              {warning}
            </Text>
          ))}
        </View>
      )}{" "}
    </ScrollView>
  );
}
