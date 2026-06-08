"use client";

import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GuidanceStep } from "../constants/parkingGuidance";
import { AutoCoachingBanner } from "./AutoCoachingBanner";
import { AutoStepSuggestionCard } from "./AutoStepSuggestionCard";
import { CollisionRiskCard } from "./CollisionRiskCard";
import { HitchAngleIndicator } from "./HitchAngleIndicator";
import { ObstacleDistanceCard } from "./ObstacleDistanceCard";
import { ParkingDiagram } from "./ParkingDiagram";
import { PracticeAction, PracticeModeControls } from "./PracticeModeControls";
import { SimulatorStatusCard } from "./SimulatorStatusCard";
import { SiteObstacle } from "./SiteObstacleSelector";
import { SteeringAmountIndicator } from "./SteeringAmountIndicator";
import { SteeringWheel } from "./SteeringWheel";
import { TrainingScoreCard } from "./TrainingScoreCard";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  currentStep: GuidanceStep;
  stepIndex: number;
  totalSteps: number;
  goBack: () => void;
  goNext: () => void;
  restartPractice: () => void;
  backingSide: "left" | "right";
  setBackingSide: (side: "left" | "right") => void;
  scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
  obstacles: SiteObstacle[];
};

export function GuidanceCard({
  currentStep,
  stepIndex,
  totalSteps,
  goBack,
  goNext,
  restartPractice,
  backingSide,
  setBackingSide,
  scenario,
  setScenario,
  obstacles,
}: Props) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [practiceAction, setPracticeAction] = useState<PracticeAction>("idle");
  const [simulatedSteeringAngle, setSimulatedSteeringAngle] = useState(0);
  const [simulatedTruckAngle, setSimulatedTruckAngle] = useState(0);
  const [simulatedTrailerAngle, setSimulatedTrailerAngle] = useState(0);
  const [movementTrail, setMovementTrail] = useState<
    { x: number; y: number; angle: number }[]
  >([]);
  const sideMultiplier = backingSide === "left" ? 1 : -1;

  const steeringGuidance =
    stepIndex === 0
      ? "↑ KEEP STRAIGHT"
      : stepIndex === 1
        ? backingSide === "left"
          ? "↶ TURN LEFT"
          : "↷ TURN RIGHT"
        : stepIndex === 2
          ? backingSide === "left"
            ? "↷ TURN RIGHT"
            : "↶ TURN LEFT"
          : stepIndex === 3
            ? "↑ STRAIGHTEN WHEEL"
            : "🛑 STOP";

  const steeringAngle =
    stepIndex === 1
      ? -35 * sideMultiplier
      : stepIndex === 2
        ? 35 * sideMultiplier
        : 0;

  const trailerAngle =
    stepIndex === 1
      ? 22 * sideMultiplier
      : stepIndex === 2
        ? -18 * sideMultiplier
        : stepIndex === 3
          ? 6 * sideMultiplier
          : 0;

  const truckAngle =
    stepIndex === 1
      ? -10 * sideMultiplier
      : stepIndex === 2
        ? 12 * sideMultiplier
        : stepIndex === 3
          ? 4 * sideMultiplier
          : 0;

  useEffect(() => {
    setSimulatedSteeringAngle(steeringAngle);
    setSimulatedTruckAngle(truckAngle);
    setSimulatedTrailerAngle(trailerAngle);
    setPracticeAction("idle");
  }, [stepIndex, backingSide, steeringAngle, truckAngle, trailerAngle]);

  const steeringLabel =
    stepIndex === 1
      ? backingSide === "left"
        ? "Turn Left"
        : "Turn Right"
      : stepIndex === 2
        ? backingSide === "left"
          ? "Turn Right"
          : "Turn Left"
        : stepIndex === 3
          ? "Straighten"
          : stepIndex >= 4
            ? "Stop"
            : "Straight";

  const trainingFeedback =
    stepIndex === 0
      ? "GOOD SETUP"
      : stepIndex === 1
        ? "TRAILER STARTING TO TURN"
        : stepIndex === 2
          ? "FOLLOW THE TRAILER"
          : stepIndex === 3
            ? "STRAIGHTEN NOW"
            : "STOP AND CHECK";

  const feedbackColor =
    stepIndex === totalSteps - 1
      ? "#dc2626"
      : stepIndex === 3
        ? "#f97316"
        : "#16a34a";

  const bannerColor = steeringGuidance === "🛑 STOP" ? "#dc2626" : "#0891b2";
  const voicePrompt =
    currentStep.voicePrompt ?? `${steeringGuidance}. ${currentStep.title}`;

  useEffect(() => {
    if (!voiceEnabled) {
      Speech.stop();
      return;
    }

    Speech.stop();
    Speech.speak(voicePrompt, {
      language: "en-US",
      rate: 0.9,
      pitch: 1.0,
    });

    return () => {
      Speech.stop();
    };
  }, [voicePrompt, voiceEnabled]);

  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  function moveTowardZero(value: number, amount: number) {
    if (value > 0) return Math.max(0, value - amount);
    if (value < 0) return Math.min(0, value + amount);
    return 0;
  }

  function getScenarioPhysicsMultiplier() {
    if (scenario === "easy") return 0.75;
    if (scenario === "tight") return 1.25;
    return 1;
  }

  function getJackknifeLimit() {
    if (scenario === "easy") return 42;
    if (scenario === "tight") return 32;
    return 36;
  }

  function calculateTrailerChangeWhileBacking({
    steeringAngle,
    trailerAngle,
  }: {
    steeringAngle: number;
    trailerAngle: number;
  }) {
    const physicsMultiplier = getScenarioPhysicsMultiplier();

    const steeringInfluence = steeringAngle * -0.12;
    const trailerMomentum = trailerAngle * 0.06;

    return (steeringInfluence + trailerMomentum) * physicsMultiplier;
  }

  function calculateTruckChangeFromSteering(steeringAngle: number) {
    return steeringAngle * 0.08;
  }
  function resetSimulation() {
    setSimulatedSteeringAngle(steeringAngle);
    setSimulatedTruckAngle(truckAngle);
    setSimulatedTrailerAngle(trailerAngle);
    setPracticeAction("idle");
    setMovementTrail([]);
  }

  function handlePracticeAction(action: PracticeAction) {
    setPracticeAction(action);

    const jackknifeLimit = getJackknifeLimit();

    if (action === "steerLeft") {
      setSimulatedSteeringAngle((current) => clamp(current - 10, -45, 45));

      // Add a small visual truck preview so the diagram reacts immediately
      setSimulatedTruckAngle((current) => clamp(current - 3, -25, 25));

      return;
    }

    if (action === "steerRight") {
      setSimulatedSteeringAngle((current) => clamp(current + 10, -45, 45));

      // Add a small visual truck preview so the diagram reacts immediately
      setSimulatedTruckAngle((current) => clamp(current + 3, -25, 25));

      return;
    }

    if (action === "backing") {
      setSimulatedTruckAngle((currentTruckAngle) => {
        const steeringEffect = simulatedSteeringAngle * 0.08;
        const nextTruckAngle =
          moveTowardZero(currentTruckAngle, 1.5) + steeringEffect;

        return clamp(nextTruckAngle, -25, 25);
      });

      setSimulatedTrailerAngle((currentTrailerAngle) => {
        const trailerChange = calculateTrailerChangeWhileBacking({
          steeringAngle: simulatedSteeringAngle,
          trailerAngle: currentTrailerAngle,
        });

        return clamp(
          currentTrailerAngle + trailerChange,
          -jackknifeLimit,
          jackknifeLimit,
        );
      });

      setMovementTrail((current) => {
        const nextIndex = current.length;

        return [
          ...current.slice(-10),
          {
            x: 70 + nextIndex * 12,
            y: 160 - Math.min(Math.abs(simulatedTrailerAngle), 35),
            angle: simulatedTrailerAngle,
          },
        ];
      });

      return;
    }
    if (action === "forward") {
      setSimulatedSteeringAngle((current) => moveTowardZero(current, 10));
      setSimulatedTruckAngle((current) => moveTowardZero(current, 8));
      setSimulatedTrailerAngle((current) => moveTowardZero(current, 10));
      return;
    }

    if (action === "stop") {
      return;
    }
  }

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
      <Text style={{ fontSize: 12, fontWeight: "bold", color: "#0e7490" }}>
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
      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
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
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>Back</Text>
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
            style={{ textAlign: "center", fontWeight: "bold", color: "white" }}
          >
            {stepIndex === totalSteps - 1 ? "Done" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        {(["left", "right"] as const).map((side) => {
          const selected = backingSide === side;

          return (
            <TouchableOpacity
              key={side}
              onPress={() => setBackingSide(side)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                backgroundColor: selected ? "#0f172a" : "white",
                borderWidth: 1,
                borderColor: selected ? "#0f172a" : "#cbd5e1",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "900",
                  color: selected ? "white" : "#0f172a",
                  fontSize: 12,
                }}
              >
                {side === "left" ? "Left-side" : "Right-side"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
        {(["easy", "normal", "tight"] as const).map((item) => {
          const selected = scenario === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => setScenario(item)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 12,
                backgroundColor: selected ? "#7c3aed" : "white",
                borderWidth: 1,
                borderColor: selected ? "#7c3aed" : "#cbd5e1",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "900",
                  color: selected ? "white" : "#0f172a",
                  fontSize: 12,
                }}
              >
                {item === "easy"
                  ? "Easy"
                  : item === "normal"
                    ? "Normal"
                    : "Tight"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text
        style={{
          marginTop: 8,
          textAlign: "center",
          color:
            scenario === "tight"
              ? "#dc2626"
              : scenario === "easy"
                ? "#16a34a"
                : "#475569",
          fontWeight: "800",
          fontSize: 12,
        }}
      >
        {scenario === "easy"
          ? "Wide practice site — forgiving setup"
          : scenario === "tight"
            ? "Tight site — use smaller steering corrections"
            : "Normal practice site"}
      </Text>
      <SteeringWheel
        steeringAngle={simulatedSteeringAngle}
        label={steeringLabel}
      />
      <SteeringAmountIndicator steeringAngle={simulatedSteeringAngle} />
      <HitchAngleIndicator
        truckAngle={simulatedTruckAngle}
        trailerAngle={simulatedTrailerAngle}
        scenario={scenario}
      />
      {stepIndex === totalSteps - 1 ? (
        <>
          <TrainingScoreCard
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            steeringAngle={simulatedSteeringAngle}
            truckAngle={simulatedTruckAngle}
            trailerAngle={simulatedTrailerAngle}
            scenario={scenario}
          />
          <View
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              backgroundColor: "#f8fafc",
              borderWidth: 1,
              borderColor: "#cbd5e1",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: "900",
                color: "#334155",
              }}
            >
              SESSION SUMMARY
            </Text>

            <Text style={{ marginTop: 8, fontWeight: "700", color: "#0f172a" }}>
              Scenario:{" "}
              {scenario === "easy"
                ? "Easy site"
                : scenario === "normal"
                  ? "Normal site"
                  : "Tight site"}
            </Text>

            <Text style={{ marginTop: 4, fontWeight: "700", color: "#0f172a" }}>
              Backing side:{" "}
              {backingSide === "left"
                ? "Left-side back-in"
                : "Right-side back-in"}
            </Text>

            <Text style={{ marginTop: 4, fontWeight: "700", color: "#0f172a" }}>
              Main coaching note:{" "}
              {scenario === "tight"
                ? "Use smaller steering corrections and stop more often."
                : scenario === "easy"
                  ? "Good practice setup. Focus on smooth steering."
                  : "Keep watching the trailer angle and straighten early."}
            </Text>
          </View>

          <TouchableOpacity
            onPress={restartPractice}
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 12,
              backgroundColor: "#16a34a",
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "900",
                fontSize: 16,
              }}
            >
              🔄 Restart Practice
            </Text>
          </TouchableOpacity>
        </>
      ) : null}
      <View
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          backgroundColor: feedbackColor,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "900",
            fontSize: 16,
          }}
        >
          {trainingFeedback}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        <TouchableOpacity
          onPress={() => {
            Speech.stop();
            setVoiceEnabled((current) => !current);
          }}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            backgroundColor: voiceEnabled ? "#0f172a" : "#64748b",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "900",
              fontSize: 12,
            }}
          >
            {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Speech.stop();
            Speech.speak(voicePrompt, {
              language: "en-US",
              rate: 0.9,
              pitch: 1.0,
            });
          }}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            backgroundColor: "#0f172a",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "900",
              fontSize: 12,
            }}
          >
            🔁 Repeat
          </Text>
        </TouchableOpacity>
      </View>
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
      <Text style={{ marginTop: 10, fontSize: 16, lineHeight: 23 }}>
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
          <Text style={{ color: "#9a3412", fontWeight: "bold" }}>
            ⚠️ {currentStep.warning}
          </Text>
        </View>
      ) : null}
      <ParkingDiagram
        stepIndex={stepIndex}
        backingSide={backingSide}
        obstacles={obstacles}
        simulatedTruckAngle={simulatedTruckAngle}
        simulatedTrailerAngle={simulatedTrailerAngle}
        simulatedSteeringAngle={simulatedSteeringAngle}
        practiceAction={practiceAction}
        movementTrail={movementTrail}
      />
      <PracticeModeControls
        practiceAction={practiceAction}
        onPracticeAction={handlePracticeAction}
        onResetSimulation={resetSimulation}
        backingSide={backingSide}
      />

      <SimulatorStatusCard
        practiceAction={practiceAction}
        simulatedSteeringAngle={simulatedSteeringAngle}
        simulatedTruckAngle={simulatedTruckAngle}
        simulatedTrailerAngle={simulatedTrailerAngle}
        scenario={scenario}
      />

      <AutoStepSuggestionCard
        practiceAction={practiceAction}
        simulatedSteeringAngle={simulatedSteeringAngle}
        simulatedTruckAngle={simulatedTruckAngle}
        simulatedTrailerAngle={simulatedTrailerAngle}
        scenario={scenario}
        stepIndex={stepIndex}
        backingSide={backingSide}
      />

      <ObstacleDistanceCard
        stepIndex={stepIndex}
        backingSide={backingSide}
        scenario={scenario}
        obstacles={obstacles}
        trailerAngle={simulatedTrailerAngle}
      />

      <AutoCoachingBanner
        stepIndex={stepIndex}
        backingSide={backingSide}
        scenario={scenario}
        obstacles={obstacles}
        trailerAngle={simulatedTrailerAngle}
        steeringAngle={simulatedSteeringAngle}
        practiceAction={practiceAction}
      />
      <CollisionRiskCard
        stepIndex={stepIndex}
        backingSide={backingSide}
        scenario={scenario}
        obstacles={obstacles}
        trailerAngle={simulatedTrailerAngle}
      />
    </View>
  );
}
