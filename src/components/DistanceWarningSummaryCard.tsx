import * as Speech from "expo-speech";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { DistanceSource } from "../types/lidar";
import {
  ClearanceItem,
  ClearanceLevel,
  getClearanceLevel,
  getLevelStyles,
  getSpecificWarningReason,
  getVoiceWarning,
} from "../utils/clearanceWarnings";

type Props = {
  clearanceItems: ClearanceItem[];
  compact?: boolean;
  showVoiceButton?: boolean;
  distanceSource?: DistanceSource;
};

export function DistanceWarningSummaryCard({
  clearanceItems,
  compact = false,
  showVoiceButton = true,
  distanceSource = "manual",
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

  const levelStyles = getLevelStyles(worstLevel);
  const voiceWarning = getVoiceWarning(worstLevel, warningReason);

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
