"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { AppFooterDisclaimer } from "../components/AppFooterDisclaimer";
import { AppHeaderCard } from "../components/AppHeaderCard";
import { GuidanceCard } from "../components/GuidanceCard";
import { HowToUseCard } from "../components/HowToUseCard";
import { ParkingTypeSelector } from "../components/ParkingTypeSelector";
import { RigSetupCard } from "../components/RigSetupCard";
import { SafetyDisclaimerCard } from "../components/SafetyDisclaimerCard";
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

function getObstacleWarning(obstacles: SiteObstacle[]) {
  const warnings: string[] = [];

  if (obstacles.includes("poleRight")) {
    warnings.push("🚧 Pole right: start wider");
  }

  if (obstacles.includes("treeLeft")) {
    warnings.push("🌳 Tree left: shallow angle");
  }

  if (obstacles.includes("lowBranch")) {
    warnings.push("🌿 Low branch: check roof");
  }

  if (obstacles.includes("tightHookupSide")) {
    warnings.push("⚡ Hookup side: leave room");
  }

  return warnings;
}

export default function Index() {
  const [truckLength, setTruckLength] = useState("20");
  const [trailerLength, setTrailerLength] = useState("30");

  const [draftTruckLength, setDraftTruckLength] = useState("20");
  const [draftTrailerLength, setDraftTrailerLength] = useState("30");

  const [isEditingRigSetup, setIsEditingRigSetup] = useState(false);
  const [parkingType, setParkingType] = useState<ParkingType>("back-in");
  const [stepIndex, setStepIndex] = useState(0);

  const [backingSide, setBackingSide] = useState<"left" | "right">("left");
  const [scenario, setScenario] = useState<"easy" | "normal" | "tight">(
    "normal",
  );

  const [obstacles, setObstacles] = useState<SiteObstacle[]>([]);

  const totalLength = (Number(truckLength) || 0) + (Number(trailerLength) || 0);
  const draftTotalLength =
    (Number(draftTruckLength) || 0) + (Number(draftTrailerLength) || 0);
  const headerTotalLength = isEditingRigSetup ? draftTotalLength : totalLength;

  const steps = guidanceByType[parkingType] ?? guidanceByType["back-in"];
  const safeStepIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[safeStepIndex];

  const obstacleWarnings = getObstacleWarning(obstacles);

  useEffect(() => {
    let mounted = true;

    async function loadRigSetup() {
      try {
        const savedSetup = await AsyncStorage.getItem(RIG_SETUP_STORAGE_KEY);

        if (!mounted || !savedSetup) return;

        const parsed = JSON.parse(savedSetup) as Partial<SavedRigSetup>;

        if (typeof parsed.truckLength === "string") {
          setTruckLength(parsed.truckLength);
          setDraftTruckLength(parsed.truckLength);
        }

        if (typeof parsed.trailerLength === "string") {
          setTrailerLength(parsed.trailerLength);
          setDraftTrailerLength(parsed.trailerLength);
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

  function selectParkingType(type: ParkingType) {
    setParkingType(type);
    setStepIndex(0);
  }

  function startEditingRigSetup() {
    setDraftTruckLength(truckLength);
    setDraftTrailerLength(trailerLength);
    setIsEditingRigSetup(true);
  }

  async function saveRigSetupNow() {
    const nextTruckLength = draftTruckLength.trim() || "0";
    const nextTrailerLength = draftTrailerLength.trim() || "0";

    try {
      await AsyncStorage.setItem(
        RIG_SETUP_STORAGE_KEY,
        JSON.stringify({
          truckLength: nextTruckLength,
          trailerLength: nextTrailerLength,
          updatedAt: new Date().toISOString(),
        }),
      );

      setTruckLength(nextTruckLength);
      setTrailerLength(nextTrailerLength);
      setDraftTruckLength(nextTruckLength);
      setDraftTrailerLength(nextTrailerLength);
      setIsEditingRigSetup(false);

      console.log("Saved rig setup:", {
        truckLength: nextTruckLength,
        trailerLength: nextTrailerLength,
      });
    } catch (error) {
      console.warn("Failed to save rig setup", error);
    }
  }

  function cancelRigSetupEdit() {
    setDraftTruckLength(truckLength);
    setDraftTrailerLength(trailerLength);
    setIsEditingRigSetup(false);
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
      <AppHeaderCard totalLength={headerTotalLength} />

      <HowToUseCard />

      <SafetyDisclaimerCard />

      {isEditingRigSetup ? (
        <>
          <RigSetupCard
            truckLength={draftTruckLength}
            setTruckLength={setDraftTruckLength}
            trailerLength={draftTrailerLength}
            setTrailerLength={setDraftTrailerLength}
            totalLength={draftTotalLength}
          />

          <TouchableOpacity
            onPress={saveRigSetupNow}
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
              ✅ Save Rig Setup
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={cancelRigSetupEdit}
            style={{
              marginTop: 8,
              padding: 12,
              borderRadius: 12,
              backgroundColor: "#e2e8f0",
            }}
          >
            <Text
              style={{
                color: "#0f172a",
                textAlign: "center",
                fontSize: 13,
                fontWeight: "900",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <SavedRigSetupCard
          truckLength={truckLength}
          trailerLength={trailerLength}
          totalLength={totalLength}
          backingSide={backingSide}
          scenario={scenario}
          onEditSetup={startEditingRigSetup}
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
              fontSize: 12,
              fontWeight: "900",
              color: "#92400e",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            Obstacle Coaching
          </Text>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "800",
              color: "#92400e",
              lineHeight: 18,
            }}
          >
            {obstacleWarnings.join(" • ")}
          </Text>
        </View>
      ) : null}

      <GuidanceCard
        currentStep={currentStep}
        stepIndex={safeStepIndex}
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

      <AppFooterDisclaimer />
    </ScrollView>
  );
}
