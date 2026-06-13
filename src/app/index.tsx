"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { GuidanceCard } from "../components/GuidanceCard";
import { ParkingTypeSelector } from "../components/ParkingTypeSelector";
import { RigSetupCard } from "../components/RigSetupCard";
import { SavedRigSetupCard } from "../components/SavedRigSetupCard";
import {
  SiteObstacle,
  SiteObstacleSelector,
} from "../components/SiteObstacleSelector";
import { ParkingType, guidanceByType } from "../constants/parkingGuidance";

const RIG_SETUP_STORAGE_KEY = "rvParkingRigSetup";

type SavedRigSetup = {
  truckLength: string;
  trailerLength: string;
};

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
  const [isEditingRigSetup, setIsEditingRigSetup] = useState(false);

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

  useEffect(() => {
    let mounted = true;

    async function loadRigSetup() {
      try {
        const savedSetup = await AsyncStorage.getItem(RIG_SETUP_STORAGE_KEY);

        if (!mounted || !savedSetup) return;

        const parsed = JSON.parse(savedSetup) as Partial<SavedRigSetup>;

        if (typeof parsed.truckLength === "string") {
          setTruckLength(parsed.truckLength);
        }

        if (typeof parsed.trailerLength === "string") {
          setTrailerLength(parsed.trailerLength);
        }
      } catch (error) {
        console.warn("Failed to load rig setup", error);
      }
    }

    loadRigSetup();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    async function saveRigSetup() {
      try {
        await AsyncStorage.setItem(
          RIG_SETUP_STORAGE_KEY,
          JSON.stringify({
            truckLength,
            trailerLength,
          }),
        );
      } catch (error) {
        console.warn("Failed to save rig setup", error);
      }
    }

    saveRigSetup();
  }, [truckLength, trailerLength]);

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
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#0f172a",
        }}
      >
        RV Parking Assistant
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 14,
          fontWeight: "700",
          color: "#475569",
        }}
      >
        Total rig length: {totalLength} ft
      </Text>

      {isEditingRigSetup ? (
        <>
          <RigSetupCard
            truckLength={truckLength}
            setTruckLength={setTruckLength}
            trailerLength={trailerLength}
            setTrailerLength={setTrailerLength}
          />

          <TouchableOpacity
            onPress={() => setIsEditingRigSetup(false)}
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 12,
              backgroundColor: "#16a34a",
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 13,
                fontWeight: "900",
              }}
            >
              ✅ Done Editing Setup
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <SavedRigSetupCard
          truckLength={truckLength}
          trailerLength={trailerLength}
          backingSide={backingSide}
          scenario={scenario}
          onEditSetup={() => setIsEditingRigSetup(true)}
        />
      )}

      <ParkingTypeSelector
        parkingType={parkingType}
        selectParkingType={selectParkingType}
      />

      <SiteObstacleSelector obstacles={obstacles} setObstacles={setObstacles} />

      {obstacleWarnings.length > 0 ? (
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
          <Text
            style={{
              fontWeight: "700",
              marginBottom: 6,
            }}
          >
            Obstacle Coaching
          </Text>

          {obstacleWarnings.map((warning) => (
            <Text key={warning} style={{ marginBottom: 4 }}>
              {warning}
            </Text>
          ))}
        </View>
      ) : null}

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
    </ScrollView>
  );
}
