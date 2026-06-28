import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ClearanceValues } from "../types/clearance";
import { LidarClearanceReading } from "../types/lidar";
import { lidarReadingToClearanceValues } from "../utils/lidarToClearanceValues";

type Props = {
  manualModeActive?: boolean;
  onApplyTestReading?: (values: ClearanceValues) => void;
};

type ChecklistStatus = "done" | "current" | "future";

export function LidarReadinessCard({
  manualModeActive = true,
  onApplyTestReading,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const applyTestLidarReading = () => {
    const testReading: LidarClearanceReading = {
      left: 42,
      right: 30,
      rear: 12,
      roof: 48,
      source: "lidar",
      timestamp: Date.now(),
    };

    const values = lidarReadingToClearanceValues(testReading);

    onApplyTestReading?.(values);
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

          <TouchableOpacity
            onPress={applyTestLidarReading}
            activeOpacity={0.85}
            style={{
              marginTop: 12,
              paddingVertical: 11,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor: "#0f172a",
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
              Test LiDAR Reading
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              marginTop: 6,
              fontSize: 11,
              fontWeight: "700",
              color: "#64748b",
              textAlign: "center",
              lineHeight: 16,
            }}
          >
            Inserts sample values: left 42, right 30, rear 12, roof 48 inches.
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
              value="Not connected yet"
              status="planned"
            />

            <LidarStatusRow
              label="Distance source"
              value="Manual mode"
              status="manual"
            />

            <LidarStatusRow
              label="Left side distance"
              value="Manual entry"
              status="manual"
            />

            <LidarStatusRow
              label="Right side distance"
              value="Manual entry"
              status="manual"
            />

            <LidarStatusRow
              label="Rear distance"
              value="Manual entry"
              status="manual"
            />

            <LidarStatusRow
              label="Roof / branch distance"
              value="Manual entry"
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
