import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ClearanceValues } from "../types/clearance";
import { DistanceSource, LidarClearanceReading } from "../types/lidar";
import {
  ClearanceItem,
  getClearanceLevel,
  getLevelStyles,
  getSpecificWarningReason,
  parseDistance,
} from "../utils/clearanceWarnings";

import { LidarDeviceCapability } from "../types/lidarDevice";
import {
  checkRealLidarSupportPlaceholder,
  createManualModeBridgeResult,
  createTestLidarBridgeResult,
  getLidarDeviceCapabilityPlaceholder,
  LidarSensorStatus,
} from "../utils/lidarSensorBridge";

type Props = {
  manualModeActive?: boolean;
  distanceSource: DistanceSource;
  clearanceValues: ClearanceValues;
  stopRecoveryConfirmed: boolean;
  onApplyTestReading?: (values: ClearanceValues) => void;
  onClearTestReading?: () => void;
};

type ChecklistStatus = "done" | "current" | "future";

export function LidarReadinessCard({
  manualModeActive = true,
  distanceSource,
  clearanceValues,
  stopRecoveryConfirmed,
  onApplyTestReading,
  onClearTestReading,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const [bridgeStatus, setBridgeStatus] =
    useState<LidarSensorStatus>("manual-mode");

  const [bridgeMessage, setBridgeMessage] = useState(
    createManualModeBridgeResult().message,
  );
  const [deviceCapability, setDeviceCapability] =
    useState<LidarDeviceCapability | null>(null);

  const bridgeStatusLabel =
    bridgeStatus === "test-mode"
      ? "Test Mode"
      : bridgeStatus === "not-connected"
        ? "Not Connected"
        : bridgeStatus === "not-supported"
          ? "Not Supported"
          : bridgeStatus === "real-lidar-ready"
            ? "Real LiDAR Ready"
            : bridgeStatus === "reading"
              ? "Reading"
              : "Manual Mode";

  const currentClearanceItems: ClearanceItem[] = [
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

  const hasCurrentClearanceValue =
    clearanceValues.left.trim() !== "" ||
    clearanceValues.right.trim() !== "" ||
    clearanceValues.rear.trim() !== "" ||
    clearanceValues.roof.trim() !== "";

  const currentLevels = currentClearanceItems.map((item) =>
    getClearanceLevel(item.value),
  );

  const currentWorstLevel = currentLevels.includes("stop")
    ? "stop"
    : currentLevels.includes("caution")
      ? "caution"
      : "safe";

  const currentLevelStyles = getLevelStyles(currentWorstLevel);
  const currentWarningReason = getSpecificWarningReason(currentClearanceItems);

  const applyTestLidarReading = (readingType: "safe" | "caution" | "stop") => {
    const testReading: LidarClearanceReading =
      readingType === "safe"
        ? {
            left: 60,
            right: 54,
            rear: 48,
            roof: 72,
            source: "lidar",
            timestamp: Date.now(),
          }
        : readingType === "caution"
          ? {
              left: 42,
              right: 30,
              rear: 40,
              roof: 60,
              source: "lidar",
              timestamp: Date.now(),
            }
          : {
              left: 42,
              right: 30,
              rear: 12,
              roof: 48,
              source: "lidar",
              timestamp: Date.now(),
            };

    const bridgeResult = createTestLidarBridgeResult(testReading);

    setBridgeStatus(bridgeResult.status);
    setBridgeMessage(bridgeResult.message);

    if (bridgeResult.clearanceValues) {
      onApplyTestReading?.(bridgeResult.clearanceValues);
    }
  };

  const checkRealLidarAvailability = () => {
    const bridgeResult = checkRealLidarSupportPlaceholder();
    const capabilityResult = getLidarDeviceCapabilityPlaceholder();

    setBridgeStatus(bridgeResult.status);
    setBridgeMessage(bridgeResult.message);
    setDeviceCapability(capabilityResult);
  };
  const clearTestLidarReading = () => {
    const manualResult = createManualModeBridgeResult();

    setBridgeStatus(manualResult.status);
    setBridgeMessage(manualResult.message);
    setDeviceCapability(null);

    onClearTestReading?.();
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
      <TouchableOpacity
        onPress={() => setExpanded((current) => !current)}
        activeOpacity={0.85}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "900",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              LiDAR Distance Assist
            </Text>

            <View
              style={{
                alignSelf: "flex-start",
                marginTop: 6,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 999,
                backgroundColor:
                  bridgeStatus === "test-mode"
                    ? "#ecfeff"
                    : bridgeStatus === "not-connected"
                      ? "#fff7ed"
                      : "#f1f5f9",
                borderWidth: 1,
                borderColor:
                  bridgeStatus === "test-mode"
                    ? "#06b6d4"
                    : bridgeStatus === "not-connected"
                      ? "#fb923c"
                      : "#cbd5e1",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "900",
                  color:
                    bridgeStatus === "test-mode"
                      ? "#0e7490"
                      : bridgeStatus === "not-connected"
                        ? "#9a3412"
                        : "#475569",
                }}
              >
                LiDAR Bridge: {bridgeStatusLabel}
              </Text>
            </View>

            <Text
              style={{
                marginTop: 5,
                fontSize: 11,
                fontWeight: "700",
                color: "#64748b",
                lineHeight: 15,
              }}
            >
              {bridgeMessage}
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 12,
                fontWeight: "700",
                color: "#475569",
                lineHeight: 17,
              }}
            >
              {manualModeActive
                ? "Manual distance mode is active. The app is now prepared for future LiDAR readings."
                : "LiDAR distance assist placeholder."}
            </Text>

            <View
              style={{
                alignSelf: "flex-start",
                marginTop: 8,
                paddingVertical: 4,
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
                  fontSize: 11,
                  fontWeight: "900",
                  color: distanceSource === "lidar" ? "#0e7490" : "#475569",
                }}
              >
                Distance Source:{" "}
                {distanceSource === "lidar"
                  ? "Test LiDAR Reading"
                  : "Manual Entry"}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            {expanded ? "Hide" : "Show"}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded ? (
        <>
          <View
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 14,
              backgroundColor: "#ecfeff",
              borderWidth: 1,
              borderColor: "#67e8f9",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "900",
                color: "#0e7490",
                textAlign: "center",
              }}
            >
              Manual Mode Active
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 13,
                fontWeight: "700",
                color: "#155e75",
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              For now, you enter clearance distances manually. Later, LiDAR can
              update those same distance values automatically.
            </Text>
          </View>

          <View style={{ marginTop: 12, gap: 8 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "900",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: 0.4,
                textAlign: "center",
              }}
            >
              Test LiDAR Readings
            </Text>

            <TouchableOpacity
              onPress={() => applyTestLidarReading("safe")}
              activeOpacity={0.85}
              style={{
                paddingVertical: 11,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: "#dcfce7",
                borderWidth: 1,
                borderColor: "#22c55e",
              }}
            >
              <Text
                style={{
                  color: "#166534",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: "900",
                }}
              >
                Test SAFE Reading
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => applyTestLidarReading("caution")}
              activeOpacity={0.85}
              style={{
                paddingVertical: 11,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: "#fef9c3",
                borderWidth: 1,
                borderColor: "#eab308",
              }}
            >
              <Text
                style={{
                  color: "#854d0e",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: "900",
                }}
              >
                Test CAUTION Reading
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => applyTestLidarReading("stop")}
              activeOpacity={0.85}
              style={{
                paddingVertical: 11,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: "#fee2e2",
                borderWidth: 1,
                borderColor: "#ef4444",
              }}
            >
              <Text
                style={{
                  color: "#991b1b",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: "900",
                }}
              >
                Test STOP Reading
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                marginTop: 2,
                fontSize: 11,
                fontWeight: "700",
                color: "#64748b",
                textAlign: "center",
                lineHeight: 16,
              }}
            >
              SAFE uses all clearances above 36 inches. CAUTION uses right side
              30 inches. STOP uses rear 12 inches.
            </Text>

            {hasCurrentClearanceValue ? (
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: currentLevelStyles.backgroundColor,
                  borderWidth: 1,
                  borderColor: currentLevelStyles.borderColor,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "900",
                    color: currentLevelStyles.textColor,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    textAlign: "center",
                  }}
                >
                  Current Distance Status
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 13,
                    fontWeight: "900",
                    color: currentLevelStyles.textColor,
                    textAlign: "center",
                    lineHeight: 18,
                  }}
                >
                  {currentLevelStyles.label}: {currentWarningReason}
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 11,
                    fontWeight: "800",
                    color: currentLevelStyles.textColor,
                    textAlign: "center",
                  }}
                >
                  Source:{" "}
                  {distanceSource === "lidar"
                    ? "Test LiDAR Reading"
                    : "Manual Entry"}
                </Text>

                {currentWorstLevel === "stop" ? (
                  <View
                    style={{
                      alignSelf: "center",
                      marginTop: 7,
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      borderRadius: 999,
                      backgroundColor: stopRecoveryConfirmed
                        ? "#dcfce7"
                        : "#fee2e2",
                      borderWidth: 1,
                      borderColor: stopRecoveryConfirmed
                        ? "#22c55e"
                        : "#ef4444",
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
                ) : null}
              </View>
            ) : null}

            <TouchableOpacity
              onPress={checkRealLidarAvailability}
              activeOpacity={0.85}
              style={{
                marginTop: 10,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: "#f8fafc",
                borderWidth: 1,
                borderColor: "#94a3b8",
              }}
            >
              <Text
                style={{
                  color: "#334155",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: "900",
                }}
              >
                Check Real LiDAR Availability
              </Text>
            </TouchableOpacity>
            {deviceCapability ? (
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: "#fff7ed",
                  borderWidth: 1,
                  borderColor: "#fb923c",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "900",
                    color: "#9a3412",
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    textAlign: "center",
                  }}
                >
                  Device Capability
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 13,
                    fontWeight: "900",
                    color: "#9a3412",
                    textAlign: "center",
                    lineHeight: 18,
                  }}
                >
                  {deviceCapability.status === "unavailable-in-expo-go"
                    ? "Unavailable in Expo Go"
                    : deviceCapability.status}
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    fontWeight: "800",
                    color: "#9a3412",
                    textAlign: "center",
                    lineHeight: 17,
                  }}
                >
                  {deviceCapability.message}
                </Text>

                <View
                  style={{
                    marginTop: 8,
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: "rgba(255,255,255,0.65)",
                    borderWidth: 1,
                    borderColor: "#fed7aa",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "800",
                      color: "#9a3412",
                      textAlign: "center",
                      lineHeight: 16,
                    }}
                  >
                    Platform: {deviceCapability.platform.toUpperCase()}
                    {"\n"}
                    Development build required:{" "}
                    {deviceCapability.requiresDevelopmentBuild ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={clearTestLidarReading}
            activeOpacity={0.85}
            style={{
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor: "#f8fafc",
              borderWidth: 1,
              borderColor: "#cbd5e1",
            }}
          >
            <Text
              style={{
                color: "#334155",
                textAlign: "center",
                fontSize: 13,
                fontWeight: "900",
              }}
            >
              Clear Test LiDAR Reading
            </Text>
          </TouchableOpacity>

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
                fontSize: 13,
                fontWeight: "900",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              LiDAR-ready checklist
            </Text>

            <View style={{ marginTop: 10, gap: 8 }}>
              <ChecklistRow
                status="done"
                title="Manual distance warnings"
                detail="SAFE / CAUTION / STOP logic is working."
              />

              <ChecklistRow
                status="done"
                title="Shared clearance values"
                detail="index.tsx stores the left, right, rear, and roof values."
              />

              <ChecklistRow
                status="done"
                title="Voice safety alerts"
                detail="Manual voice warning and automatic STOP voice alert are working."
              />

              <ChecklistRow
                status="done"
                title="Coach integration"
                detail="GuidanceCard and SmartNextMoveCard can use the same warning data."
              />

              <ChecklistRow
                status="current"
                title="Manual mode"
                detail="This is the active mode until sensor readings are added."
              />

              <ChecklistRow
                status="future"
                title="Native LiDAR sensor module"
                detail="Future iOS work will read distance data from supported LiDAR devices."
              />

              <ChecklistRow
                status="future"
                title="Development build"
                detail="Real LiDAR access will likely require a custom development build, not Expo Go."
              />
            </View>
          </View>

          <View style={{ marginTop: 12, gap: 8 }}>
            <LidarStatusRow
              label="LiDAR status"
              value={
                bridgeStatus === "not-connected"
                  ? "Not connected yet"
                  : bridgeStatus === "test-mode"
                    ? "Test mode active"
                    : "Manual mode"
              }
              status={bridgeStatus === "test-mode" ? "manual" : "planned"}
            />

            <LidarStatusRow
              label="Distance source"
              value={
                distanceSource === "lidar"
                  ? "Test LiDAR reading"
                  : "Manual mode"
              }
              status={distanceSource === "lidar" ? "manual" : "planned"}
            />

            <LidarStatusRow
              label="Left side distance"
              value={
                clearanceValues.left
                  ? `${clearanceValues.left} in`
                  : "Manual entry"
              }
              status="manual"
            />

            <LidarStatusRow
              label="Right side distance"
              value={
                clearanceValues.right
                  ? `${clearanceValues.right} in`
                  : "Manual entry"
              }
              status="manual"
            />

            <LidarStatusRow
              label="Rear distance"
              value={
                clearanceValues.rear
                  ? `${clearanceValues.rear} in`
                  : "Manual entry"
              }
              status="manual"
            />

            <LidarStatusRow
              label="Roof / branch distance"
              value={
                clearanceValues.roof
                  ? `${clearanceValues.roof} in`
                  : "Manual entry"
              }
              status="manual"
            />
          </View>

          <View
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 14,
              backgroundColor: "#fff7ed",
              borderWidth: 1,
              borderColor: "#fed7aa",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "900",
                color: "#9a3412",
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Future connection
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 12,
                fontWeight: "700",
                color: "#9a3412",
                lineHeight: 17,
              }}
            >
              Future LiDAR readings should update the existing clearanceValues
              object. That means the SAFE / CAUTION / STOP logic, compact
              GuidanceCard warning, Smart Next Move advice, and voice alerts can
              keep working without being rewritten.
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
            This card prepares the app structure for LiDAR. It does not access
            the iPhone LiDAR sensor yet.
          </Text>
        </>
      ) : null}
    </View>
  );
}

type ChecklistRowProps = {
  status: ChecklistStatus;
  title: string;
  detail: string;
};

function ChecklistRow({ status, title, detail }: ChecklistRowProps) {
  const statusText =
    status === "done" ? "Done" : status === "current" ? "Active" : "Future";

  const colors =
    status === "done"
      ? {
          backgroundColor: "#dcfce7",
          borderColor: "#22c55e",
          textColor: "#166534",
        }
      : status === "current"
        ? {
            backgroundColor: "#e0f2fe",
            borderColor: "#38bdf8",
            textColor: "#075985",
          }
        : {
            backgroundColor: "#f1f5f9",
            borderColor: "#cbd5e1",
            textColor: "#475569",
          };

  return (
    <View
      style={{
        padding: 10,
        borderRadius: 12,
        backgroundColor: colors.backgroundColor,
        borderWidth: 1,
        borderColor: colors.borderColor,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <View
          style={{
            paddingVertical: 3,
            paddingHorizontal: 7,
            borderRadius: 999,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors.borderColor,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "900",
              color: colors.textColor,
            }}
          >
            {statusText}
          </Text>
        </View>

        <Text
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: "900",
            color: colors.textColor,
          }}
        >
          {title}
        </Text>
      </View>

      <Text
        style={{
          marginTop: 5,
          fontSize: 11,
          fontWeight: "700",
          color: colors.textColor,
          lineHeight: 16,
        }}
      >
        {detail}
      </Text>
    </View>
  );
}

type LidarStatusRowProps = {
  label: string;
  value: string;
  status: "manual" | "planned";
};

function LidarStatusRow({ label, value, status }: LidarStatusRowProps) {
  const isManual = status === "manual";

  return (
    <View
      style={{
        padding: 10,
        borderRadius: 12,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: isManual ? "#bae6fd" : "#e2e8f0",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: "900",
            color: "#0f172a",
          }}
        >
          {label}
        </Text>

        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 999,
            backgroundColor: isManual ? "#e0f2fe" : "#f1f5f9",
            borderWidth: 1,
            borderColor: isManual ? "#38bdf8" : "#cbd5e1",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "900",
              color: isManual ? "#075985" : "#475569",
            }}
          >
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
}
