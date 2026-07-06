import * as Speech from "expo-speech";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ClearanceValues } from "../types/clearance";
import { DistanceSource } from "../types/lidar";
import {
  ClearanceItem,
  getClearanceLevel,
  getLevelStyles,
  getRecommendedAction,
  getSpecificWarningReason,
  getVoiceWarning,
  parseDistance,
} from "../utils/clearanceWarnings";
import { SiteObstacle } from "./SiteObstacleSelector";

type Props = {
  stepIndex: number;
  backingSide: string;
  campsiteType: string;
  obstacles: SiteObstacle[];
  scenario: string;
  voiceEnabled: boolean;
  parkingType: string;
  clearanceValues: ClearanceValues;
  distanceSource: DistanceSource;
  stopRecoveryConfirmed: boolean;
};

export function SmartNextMoveCard({
  stepIndex,
  backingSide,
  campsiteType,
  obstacles,
  scenario,
  voiceEnabled,
  parkingType,
  clearanceValues,
  distanceSource,
  stopRecoveryConfirmed,
}: Props) {
  const clearanceItems: ClearanceItem[] = [
    {
      key: "left",
      label: "Left side clearance",
      value: parseDistance(clearanceValues.left),
    },
    {
      key: "right",
      label: "Right side clearance",
      value: parseDistance(clearanceValues.right),
    },
    {
      key: "rear",
      label: "Rear clearance",
      value: parseDistance(clearanceValues.rear),
    },
    {
      key: "roof",
      label: "Roof / branch clearance",
      value: parseDistance(clearanceValues.roof),
    },
  ];

  const hasAnyClearanceValue =
    clearanceValues.left.trim() !== "" ||
    clearanceValues.right.trim() !== "" ||
    clearanceValues.rear.trim() !== "" ||
    clearanceValues.roof.trim() !== "";

  const clearanceLevels = clearanceItems.map((item) =>
    getClearanceLevel(item.value),
  );

  const clearanceWorstLevel = clearanceLevels.includes("stop")
    ? "stop"
    : clearanceLevels.includes("caution")
      ? "caution"
      : "safe";

  const clearanceStyles = getLevelStyles(clearanceWorstLevel);
  const clearanceReason = getSpecificWarningReason(clearanceItems);
  const recommendedAction = getRecommendedAction(clearanceWorstLevel);
  const distanceSourceLabel =
    distanceSource === "lidar" ? "Test LiDAR Reading" : "Manual Entry";

  const isPullThrough = parkingType === "pull-through";
  const isLeftBacking = backingSide === "left";

  const obstacleText =
    obstacles.length > 0
      ? obstacles
          .map((obstacle) => formatObstacleLabel(String(obstacle)))
          .join(", ")
      : "No selected obstacles";

  const nextMove = getNextMove({
    stepIndex,
    parkingType,
    backingSide,
    clearanceWorstLevel,
  });

  const watchArea = getWatchArea({
    parkingType,
    backingSide,
    campsiteType,
    scenario,
    obstacles,
    clearanceWorstLevel,
  });

  const safeReset = getSafeReset({
    parkingType,
    clearanceWorstLevel,
  });

  const speakNextMove = async () => {
    if (!voiceEnabled) return;

    const spokenText = hasAnyClearanceValue
      ? `${nextMove}. Distance source: ${distanceSourceLabel}. ${clearanceReason}`
      : nextMove;

    try {
      await Speech.stop();

      setTimeout(() => {
        Speech.speak(spokenText, {
          language: "en-US",
          rate: 0.9,
          pitch: 1.0,
        });
      }, 150);
    } catch {
      Speech.speak(spokenText, {
        language: "en-US",
        rate: 0.9,
        pitch: 1.0,
      });
    }
  };

  const speakDistanceWarning = async () => {
    if (!voiceEnabled || !hasAnyClearanceValue) return;

    const voiceWarning = getVoiceWarning(
      clearanceWorstLevel,
      clearanceReason,
      recommendedAction,
    );

    try {
      await Speech.stop();

      setTimeout(() => {
        Speech.speak(voiceWarning, {
          language: "en-US",
          rate: 0.9,
          pitch: 1.0,
        });
      }, 150);
    } catch {
      Speech.speak(voiceWarning, {
        language: "en-US",
        rate: 0.9,
        pitch: 1.0,
      });
    }
  };

  return (
    <View
      style={{
        marginTop: 14,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#cbd5e1",
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "900",
          color: "#0f172a",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Smart Next Move
      </Text>

      <Text
        style={{
          marginTop: 5,
          fontSize: 12,
          fontWeight: "700",
          color: "#475569",
          lineHeight: 17,
        }}
      >
        {isPullThrough
          ? "Drive-through guidance based on your selected campsite and obstacles."
          : `Backing ${isLeftBacking ? "left" : "right"} with ${scenario} difficulty.`}
      </Text>

      <View
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 14,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "900",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Next Move
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 15,
            fontWeight: "900",
            color: "#0f172a",
            lineHeight: 21,
          }}
        >
          {nextMove}
        </Text>

        {voiceEnabled ? (
          <TouchableOpacity
            onPress={speakNextMove}
            activeOpacity={0.85}
            style={{
              marginTop: 10,
              paddingVertical: 9,
              paddingHorizontal: 10,
              borderRadius: 12,
              backgroundColor: "#0f172a",
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 12,
                fontWeight: "900",
              }}
            >
              Speak Next Move
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {hasAnyClearanceValue ? (
        <View
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 14,
            backgroundColor: clearanceStyles.backgroundColor,
            borderWidth: 1,
            borderColor: clearanceStyles.borderColor,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "900",
              color: clearanceStyles.textColor,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            Distance Safety
          </Text>

          <View
            style={{
              alignSelf: "flex-start",
              marginTop: 6,
              paddingVertical: 3,
              paddingHorizontal: 8,
              borderRadius: 999,
              backgroundColor:
                distanceSource === "lidar" ? "#ecfeff" : "#f1f5f9",
              borderWidth: 1,
              borderColor: distanceSource === "lidar" ? "#06b6d4" : "#cbd5e1",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "900",
                color: distanceSource === "lidar" ? "#0e7490" : "#475569",
              }}
            >
              Distance Source: {distanceSourceLabel}
            </Text>
          </View>

          <Text
            style={{
              marginTop: 7,
              fontSize: 13,
              fontWeight: "900",
              color: clearanceStyles.textColor,
              lineHeight: 18,
            }}
          >
            {clearanceStyles.label}: {clearanceReason}
          </Text>

          {clearanceWorstLevel === "stop" ? (
            <View
              style={{
                marginTop: 8,
                padding: 10,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.65)",
                borderWidth: 1,
                borderColor: clearanceStyles.borderColor,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "900",
                  color: clearanceStyles.textColor,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                STOP Recovery Coaching
              </Text>
              <View
                style={{
                  alignSelf: "flex-start",
                  marginTop: 7,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderRadius: 999,
                  backgroundColor: stopRecoveryConfirmed
                    ? "#dcfce7"
                    : "#fee2e2",
                  borderWidth: 1,
                  borderColor: stopRecoveryConfirmed ? "#22c55e" : "#ef4444",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "900",
                    color: stopRecoveryConfirmed ? "#166534" : "#991b1b",
                  }}
                >
                  Recovery Status:{" "}
                  {stopRecoveryConfirmed
                    ? "Check Confirmed"
                    : "Not Checked Yet"}
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: 12,
                  fontWeight: "800",
                  color: clearanceStyles.textColor,
                  lineHeight: 17,
                }}
              >
                1. Hold position.
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  fontWeight: "800",
                  color: clearanceStyles.textColor,
                  lineHeight: 17,
                }}
              >
                2. Get out and inspect the closest obstacle.
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  fontWeight: "800",
                  color: clearanceStyles.textColor,
                  lineHeight: 17,
                }}
              >
                3. Pull forward slowly if the gap is still tight.
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  fontWeight: "800",
                  color: clearanceStyles.textColor,
                  lineHeight: 17,
                }}
              >
                4. Re-check before backing again.
              </Text>
            </View>
          ) : null}
          <View
            style={{
              marginTop: 8,
              padding: 10,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.55)",
              borderWidth: 1,
              borderColor: clearanceStyles.borderColor,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "900",
                color: clearanceStyles.textColor,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Recommended Action
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 12,
                fontWeight: "800",
                color: clearanceStyles.textColor,
                lineHeight: 17,
              }}
            >
              {recommendedAction}
            </Text>
          </View>

          {voiceEnabled ? (
            <TouchableOpacity
              onPress={speakDistanceWarning}
              activeOpacity={0.85}
              style={{
                marginTop: 10,
                paddingVertical: 9,
                paddingHorizontal: 10,
                borderRadius: 12,
                backgroundColor: clearanceStyles.textColor,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: "900",
                }}
              >
                Speak Distance Warning
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      <View
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 14,
          backgroundColor: "#eff6ff",
          borderWidth: 1,
          borderColor: "#bfdbfe",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "900",
            color: "#1d4ed8",
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Watch
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            fontWeight: "800",
            color: "#1e40af",
            lineHeight: 18,
          }}
        >
          {watchArea}
        </Text>
      </View>

      <View
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 14,
          backgroundColor: "#f0fdf4",
          borderWidth: 1,
          borderColor: "#bbf7d0",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "900",
            color: "#166534",
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Safe Reset
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            fontWeight: "800",
            color: "#166534",
            lineHeight: 18,
          }}
        >
          {safeReset}
        </Text>
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 11,
          fontWeight: "700",
          color: "#64748b",
          lineHeight: 16,
          textAlign: "center",
        }}
      >
        Obstacles: {obstacleText}
      </Text>
    </View>
  );
}

type NextMoveInput = {
  stepIndex: number;
  parkingType: string;
  backingSide: string;
  clearanceWorstLevel: "safe" | "caution" | "stop";
};

function getNextMove({
  stepIndex,
  parkingType,
  backingSide,
  clearanceWorstLevel,
}: NextMoveInput) {
  if (clearanceWorstLevel === "stop") {
    return "STOP now. Hold position, get out, and inspect the closest obstacle before moving again.";
  }

  if (clearanceWorstLevel === "caution") {
    return "Move very slowly. Keep your correction small and watch the closest clearance area.";
  }

  if (parkingType === "pull-through") {
    return "Pull forward slowly, keep the trailer centered, and avoid cutting the turn too early.";
  }

  const sideText = backingSide === "left" ? "left" : "right";

  if (stepIndex <= 0) {
    return `Start slowly and set up for a controlled ${sideText}-side backing angle.`;
  }

  if (stepIndex === 1) {
    return "Use small steering corrections. Let the trailer respond before adding more steering.";
  }

  if (stepIndex === 2) {
    return "Pause and check alignment. If the trailer is turning too sharply, pull forward to reset.";
  }

  if (stepIndex === 3) {
    return "Straighten the truck and trailer gradually. Do not chase the trailer with large steering moves.";
  }

  return "Finish slowly, center the trailer, and stop before final leveling or hookup checks.";
}

type WatchAreaInput = {
  parkingType: string;
  backingSide: string;
  campsiteType: string;
  scenario: string;
  obstacles: SiteObstacle[];
  clearanceWorstLevel: "safe" | "caution" | "stop";
};

function getWatchArea({
  parkingType,
  backingSide,
  campsiteType,
  scenario,
  obstacles,
  clearanceWorstLevel,
}: WatchAreaInput) {
  if (clearanceWorstLevel === "stop") {
    return "Watch the closest obstacle first. Do not rely only on mirrors or the diagram.";
  }

  if (clearanceWorstLevel === "caution") {
    return "Watch the side or rear with the smallest clearance. Move in inches, not feet.";
  }

  if (parkingType === "pull-through") {
    return "Watch rear swing, inside trailer tracking, low branches, and the exit path.";
  }

  if (obstacles.length > 0) {
    return `Watch selected obstacles closely: ${obstacles
      .map((obstacle) => formatObstacleLabel(String(obstacle)))
      .join(", ")}.`;
  }

  if (scenario === "tight") {
    return "Watch both trailer corners and the inside tracking path. Tight sites need smaller corrections.";
  }

  if (campsiteType === "angled") {
    return "Watch the inside trailer corner and the campsite entrance angle.";
  }

  return backingSide === "left"
    ? "Watch the left trailer corner and the truck front swing."
    : "Watch the right trailer corner and the truck front swing.";
}

type SafeResetInput = {
  parkingType: string;
  clearanceWorstLevel: "safe" | "caution" | "stop";
};

function getSafeReset({ parkingType, clearanceWorstLevel }: SafeResetInput) {
  if (clearanceWorstLevel === "stop") {
    return "Stop, set the brake if needed, get out and look, then pull forward to reset if clearance is not confirmed.";
  }

  if (clearanceWorstLevel === "caution") {
    return "If the gap keeps shrinking, stop and pull forward before it becomes a hard STOP.";
  }

  if (parkingType === "pull-through") {
    return "If the trailer is not centered, stop and straighten before continuing forward.";
  }

  return "If the trailer angle feels wrong, stop early and pull forward. A small reset is better than forcing the turn.";
}

function formatObstacleLabel(value: string) {
  if (value === "treeLeft") return "tree on left";
  if (value === "poleRight") return "pole on right";
  if (value === "lowBranch") return "low branch";
  if (value === "tightHookupSide") return "tight hookup side";

  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .toLowerCase();
}
