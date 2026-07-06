import * as Speech from "expo-speech";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { DistanceSource } from "../types/lidar";
import {
  ClearanceItem,
  ClearanceLevel,
  getClearanceLevel,
  getLevelStyles,
  getRecommendedAction,
  getSpecificWarningReason,
  getVoiceWarning,
} from "../utils/clearanceWarnings";

type Props = {
  clearanceItems: ClearanceItem[];
  compact?: boolean;
  showVoiceButton?: boolean;
  distanceSource?: DistanceSource;
  stopRecoveryConfirmed?: boolean;
  onChangeStopRecoveryConfirmed?: (value: boolean) => void;
};

export function DistanceWarningSummaryCard({
  clearanceItems,
  compact = false,
  showVoiceButton = true,
  distanceSource = "manual",
  stopRecoveryConfirmed = false,
  onChangeStopRecoveryConfirmed,
}: Props) {
  const worstLevel = useMemo<ClearanceLevel>(() => {
    const levels = clearanceItems.map((item) => getClearanceLevel(item.value));

    if (levels.includes("stop")) return "stop";
    if (levels.includes("caution")) return "caution";
    return "safe";
  }, [clearanceItems]);

  const distanceSourceLabel =
    distanceSource === "lidar" ? "Test LiDAR Reading" : "Manual Entry";

  const warningReason = useMemo(() => {
    return getSpecificWarningReason(clearanceItems);
  }, [clearanceItems]);
  const recommendedAction = getRecommendedAction(worstLevel);

  const levelStyles = getLevelStyles(worstLevel);
  const voiceWarning = getVoiceWarning(
    worstLevel,
    warningReason,
    recommendedAction,
  );

  // const showStopRecovery =
  //   worstLevel === "stop" && !compact && !!onChangeStopRecoveryConfirmed;
  const showStopRecovery = worstLevel === "stop" && !compact;

  return (
    <View
      style={{
        marginTop: compact ? 8 : 12,
        padding: compact ? 10 : 12,
        borderRadius: 14,
        backgroundColor: levelStyles.backgroundColor,
        borderWidth: 1,
        borderColor: levelStyles.borderColor,
      }}
    >
      <Text
        style={{
          fontSize: compact ? 13 : 16,
          fontWeight: "900",
          color: levelStyles.textColor,
          textAlign: "center",
        }}
      >
        {levelStyles.label}
      </Text>
      <View
        style={{
          alignSelf: "flex-start",
          marginTop: 6,
          paddingVertical: 3,
          paddingHorizontal: 8,
          borderRadius: 999,
          backgroundColor: distanceSource === "lidar" ? "#ecfeff" : "#f1f5f9",
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
      {!compact ? (
        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            fontWeight: "800",
            color: levelStyles.textColor,
            textAlign: "center",
            lineHeight: 18,
          }}
        >
          {levelStyles.message}
        </Text>
      ) : null}
      <View
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.75)",
          borderWidth: 1,
          borderColor: levelStyles.borderColor,
        }}
      >
        <Text
          style={{
            fontSize: compact ? 12 : 13,
            fontWeight: "900",
            color: levelStyles.textColor,
            textAlign: "center",
            lineHeight: 18,
          }}
        >
          {warningReason}
        </Text>
      </View>
      <View
        style={{
          marginTop: compact ? 6 : 10,
          padding: compact ? 8 : 10,
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.55)",
          borderWidth: 1,
          borderColor: levelStyles.borderColor,
        }}
      >
        <Text
          style={{
            fontSize: compact ? 10 : 11,
            fontWeight: "900",
            color: levelStyles.textColor,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Recommended Action
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: compact ? 11 : 12,
            fontWeight: "800",
            color: levelStyles.textColor,
            lineHeight: compact ? 15 : 17,
          }}
        >
          {recommendedAction}
        </Text>
      </View>
      {showStopRecovery ? (
        <View
          style={{
            marginTop: compact ? 8 : 10,
            padding: compact ? 8 : 10,
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.7)",
            borderWidth: 1,
            borderColor: levelStyles.borderColor,
          }}
        >
          <Text
            style={{
              fontSize: compact ? 10 : 11,
              fontWeight: "900",
              color: levelStyles.textColor,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            STOP Recovery
          </Text>

          {!stopRecoveryConfirmed ? (
            <>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: compact ? 11 : 12,
                  fontWeight: "800",
                  color: levelStyles.textColor,
                  lineHeight: compact ? 15 : 17,
                }}
              >
                Do not move yet. Get out and inspect the closest obstacle before
                continuing.
              </Text>

              <TouchableOpacity
                onPress={() => {
                  onChangeStopRecoveryConfirmed?.(true);
                }}
                activeOpacity={0.85}
                style={{
                  marginTop: 8,
                  paddingVertical: 9,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  backgroundColor: levelStyles.textColor,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: compact ? 11 : 12,
                    fontWeight: "900",
                  }}
                >
                  I got out and checked
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View
                style={{
                  marginTop: 8,
                  padding: compact ? 9 : 11,
                  borderRadius: 12,
                  backgroundColor: "#dcfce7",
                  borderWidth: 1,
                  borderColor: "#22c55e",
                }}
              >
                <Text
                  style={{
                    fontSize: compact ? 11 : 12,
                    fontWeight: "900",
                    color: "#166534",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                  }}
                >
                  Recovery Check Confirmed
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    fontSize: compact ? 11 : 12,
                    fontWeight: "800",
                    color: "#166534",
                    textAlign: "center",
                    lineHeight: compact ? 15 : 17,
                  }}
                >
                  Pull forward slowly to reset if clearance is still tight.
                  Re-check before backing again.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => onChangeStopRecoveryConfirmed?.(false)}
                activeOpacity={0.85}
                style={{
                  marginTop: 8,
                  paddingVertical: 9,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: levelStyles.borderColor,
                }}
              >
                <Text
                  style={{
                    color: levelStyles.textColor,
                    textAlign: "center",
                    fontSize: compact ? 11 : 12,
                    fontWeight: "900",
                  }}
                >
                  Reset STOP recovery
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : null}
      {showVoiceButton ? (
        <TouchableOpacity
          onPress={async () => {
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
          }}
          activeOpacity={0.85}
          style={{
            marginTop: compact ? 8 : 12,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: levelStyles.textColor,
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
            🔊 Speak Distance Warning
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
