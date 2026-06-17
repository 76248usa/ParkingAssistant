import React from "react";
import { Text, View } from "react-native";
import { SiteObstacle } from "./SiteObstacleSelector";

type TrailPoint = {
  x: number;
  y: number;
};

type Props = {
  stepIndex: number;
  backingSide: "left" | "right";
  simulatedTruckAngle: number;
  simulatedTrailerAngle: number;
  movementTrail?: TrailPoint[];
  obstacles?: SiteObstacle[];
};

const CANVAS_WIDTH = 420;
const CANVAS_HEIGHT = 210;

const TRAILER_WIDTH = 88;
const TRAILER_HEIGHT = 30;

const TRUCK_WIDTH = 54;
const TRUCK_HEIGHT = 26;

const PARKING_SPACE_WIDTH = 118;
const PARKING_SPACE_HEIGHT = 92;

type Pose = {
  trailerLeft: number;
  trailerTop: number;
  trailerRotation: number;
  truckLeft: number;
  truckTop: number;
  truckRotation: number;
};

const RIGHT_SIDE_POSES: Pose[] = [
  {
    // Step 1: rig beside the site, still mostly straight on the road
    trailerLeft: 140,
    trailerTop: 138,
    trailerRotation: 0,
    truckLeft: 82,
    truckTop: 138,
    truckRotation: 0,
  },
  {
    // Step 2: trailer begins turning toward the campsite
    trailerLeft: 182,
    trailerTop: 126,
    trailerRotation: 12,
    truckLeft: 124,
    truckTop: 135,
    truckRotation: -3,
  },
  {
    // Step 3: trailer is entering the parking space
    trailerLeft: 225,
    trailerTop: 110,
    trailerRotation: 22,
    truckLeft: 169,
    truckTop: 123,
    truckRotation: 7,
  },
  {
    // Step 4: trailer mostly inside, starting to straighten
    trailerLeft: 260,
    trailerTop: 94,
    trailerRotation: 9,
    truckLeft: 207,
    truckTop: 102,
    truckRotation: 5,
  },
  {
    // Step 5: trailer centered in the parking space
    trailerLeft: 286,
    trailerTop: 84,
    trailerRotation: 0,
    truckLeft: 234,
    truckTop: 86,
    truckRotation: 0,
  },
];

function mirrorX(left: number, width: number) {
  return CANVAS_WIDTH - left - width;
}

function getPose(stepIndex: number, backingSide: "left" | "right"): Pose {
  const index = Math.max(0, Math.min(stepIndex, RIGHT_SIDE_POSES.length - 1));
  const pose = RIGHT_SIDE_POSES[index];

  if (backingSide === "right") {
    return pose;
  }

  return {
    trailerLeft: mirrorX(pose.trailerLeft, TRAILER_WIDTH),
    trailerTop: pose.trailerTop,
    trailerRotation: -pose.trailerRotation,
    truckLeft: mirrorX(pose.truckLeft, TRUCK_WIDTH),
    truckTop: pose.truckTop,
    truckRotation: -pose.truckRotation,
  };
}

function getParkingSpace(backingSide: "left" | "right") {
  const rightSideSpace = {
    left: 270,
    top: 52,
    width: PARKING_SPACE_WIDTH,
    height: PARKING_SPACE_HEIGHT,
  };

  if (backingSide === "right") {
    return rightSideSpace;
  }

  return {
    left: mirrorX(rightSideSpace.left, rightSideSpace.width),
    top: rightSideSpace.top,
    width: rightSideSpace.width,
    height: rightSideSpace.height,
  };
}

function getGuideDots(backingSide: "left" | "right") {
  const rightDots = [
    { x: 166, y: 142 },
    { x: 195, y: 132 },
    { x: 225, y: 118 },
    { x: 253, y: 101 },
    { x: 282, y: 86 },
    { x: 312, y: 78 },
  ];

  if (backingSide === "right") {
    return rightDots;
  }

  return rightDots.map((dot) => ({
    x: CANVAS_WIDTH - dot.x,
    y: dot.y,
  }));
}

function getObstacleElements(
  obstacles: SiteObstacle[],
  parkingSpace: { left: number; top: number; width: number; height: number },
) {
  const items: {
    key: SiteObstacle;
    left: number;
    top: number;
    label: string;
    emoji: string;
  }[] = [];

  if (obstacles.includes("treeLeft")) {
    items.push({
      key: "treeLeft",
      left: parkingSpace.left - 26,
      top: parkingSpace.top + 20,
      label: "Tree",
      emoji: "🌳",
    });
  }

  if (obstacles.includes("poleRight")) {
    items.push({
      key: "poleRight",
      left: parkingSpace.left + parkingSpace.width + 8,
      top: parkingSpace.top + 22,
      label: "Pole",
      emoji: "🚧",
    });
  }

  if (obstacles.includes("lowBranch")) {
    items.push({
      key: "lowBranch",
      left: parkingSpace.left + parkingSpace.width / 2 - 18,
      top: parkingSpace.top - 24,
      label: "Branch",
      emoji: "🌿",
    });
  }

  if (obstacles.includes("tightHookupSide")) {
    items.push({
      key: "tightHookupSide",
      left: parkingSpace.left + parkingSpace.width / 2 - 24,
      top: parkingSpace.top + parkingSpace.height + 8,
      label: "Hookups",
      emoji: "⚡",
    });
  }

  return items;
}

function getStepLabel(stepIndex: number) {
  if (stepIndex === 0) return "Setup beside site";
  if (stepIndex === 1) return "Begin backing turn";
  if (stepIndex === 2) return "Trailer entering space";
  if (stepIndex === 3) return "Straighten and follow";
  return "Centered in parking space";
}

export function ParkingDiagram({
  stepIndex,
  backingSide,
  simulatedTruckAngle,
  simulatedTrailerAngle,
  movementTrail = [],
  obstacles = [],
}: Props) {
  const pose = getPose(stepIndex, backingSide);
  const parkingSpace = getParkingSpace(backingSide);
  const guideDots = getGuideDots(backingSide);
  const obstacleItems = getObstacleElements(obstacles, parkingSpace);

  const trailerRotation = pose.trailerRotation + simulatedTrailerAngle * 0.35;
  const truckRotation = pose.truckRotation + simulatedTruckAngle * 0.35;

  return (
    <View
      style={{
        marginTop: 12,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 420,
          height: 210,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#cbd5e1",
          backgroundColor: "#f8fafc",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Road / lane background */}
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 108,
            width: CANVAS_WIDTH,
            height: 76,
            backgroundColor: "#e5e7eb",
          }}
        />

        {/* Road lane line */}
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 145,
            width: CANVAS_WIDTH,
            height: 2,
            backgroundColor: "#ffffff",
            opacity: 0.9,
          }}
        />

        {/* Parking space */}
        <View
          style={{
            position: "absolute",
            left: parkingSpace.left,
            top: parkingSpace.top,
            width: parkingSpace.width,
            height: parkingSpace.height,
            borderWidth: 2,
            borderColor: "#16a34a",
            borderStyle: "dashed",
            borderRadius: 10,
            backgroundColor: "#dcfce7",
          }}
        >
          <Text
            style={{
              marginTop: 8,
              fontSize: 11,
              fontWeight: "900",
              textAlign: "center",
              color: "#166534",
            }}
          >
            PARKING SPACE
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 10,
              fontWeight: "700",
              textAlign: "center",
              color: "#15803d",
            }}
          >
            Trailer should end here
          </Text>
        </View>

        {/* Parking space center guide */}
        <View
          style={{
            position: "absolute",
            left: parkingSpace.left + parkingSpace.width / 2 - 1,
            top: parkingSpace.top + 18,
            width: 2,
            height: parkingSpace.height - 28,
            backgroundColor: "#86efac",
          }}
        />

        {/* Backing guide dots */}
        {guideDots.map((dot, index) => (
          <View
            key={`guide-${index}`}
            style={{
              position: "absolute",
              left: dot.x,
              top: dot.y,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#60a5fa",
              opacity: 0.45 + index * 0.12,
            }}
          />
        ))}

        {/* Movement trail */}
        {movementTrail.map((point, index) => (
          <View
            key={`trail-${index}`}
            style={{
              position: "absolute",
              left: point.x,
              top: point.y,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#f97316",
              opacity: 0.25 + index * 0.08,
            }}
          />
        ))}

        {/* Obstacles */}
        {obstacleItems.map((item) => (
          <View
            key={item.key}
            style={{
              position: "absolute",
              left: item.left,
              top: item.top,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
            <Text
              style={{
                marginTop: 2,
                fontSize: 9,
                fontWeight: "800",
                color: "#7c2d12",
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}

        {/* Trailer */}
        <View
          style={{
            position: "absolute",
            left: pose.trailerLeft,
            top: pose.trailerTop,
            width: TRAILER_WIDTH,
            height: TRAILER_HEIGHT,
            borderRadius: 8,
            backgroundColor: "#3b82f6",
            borderWidth: 2,
            borderColor: "#1d4ed8",
            justifyContent: "center",
            alignItems: "center",
            transform: [{ rotate: `${trailerRotation}deg` }],
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "900",
            }}
          >
            TRAILER
          </Text>
          <View
            style={{
              position: "absolute",
              left: 18,
              bottom: -5,
              width: 12,
              height: 6,
              borderRadius: 999,
              backgroundColor: "#111827",
            }}
          />

          <View
            style={{
              position: "absolute",
              right: 18,
              bottom: -5,
              width: 12,
              height: 6,
              borderRadius: 999,
              backgroundColor: "#111827",
            }}
          />
        </View>

        {/* Hitch connector */}
        <View
          style={{
            position: "absolute",
            left:
              backingSide === "right"
                ? pose.truckLeft + TRUCK_WIDTH - 2
                : pose.trailerLeft + TRAILER_WIDTH - 4,
            top:
              backingSide === "right"
                ? (pose.truckTop + pose.trailerTop) / 2 + 11
                : (pose.truckTop + pose.trailerTop) / 2 + 11,
            width: Math.max(
              18,
              Math.abs(
                backingSide === "right"
                  ? pose.trailerLeft - (pose.truckLeft + TRUCK_WIDTH)
                  : pose.truckLeft - (pose.trailerLeft + TRAILER_WIDTH),
              ) + 8,
            ),
            height: 5,
            borderRadius: 999,
            backgroundColor: "#475569",
            transform: [
              {
                rotate: `${
                  backingSide === "right"
                    ? (pose.trailerTop - pose.truckTop) * 0.35
                    : (pose.truckTop - pose.trailerTop) * 0.35
                }deg`,
              },
            ],
          }}
        />

        {/* Truck */}
        <View
          style={{
            position: "absolute",
            left: pose.truckLeft,
            top: pose.truckTop,
            width: TRUCK_WIDTH,
            height: TRUCK_HEIGHT,
            borderRadius: 7,
            backgroundColor: "#0f172a",
            borderWidth: 2,
            borderColor: "#334155",
            justifyContent: "center",
            alignItems: "center",
            transform: [{ rotate: `${truckRotation}deg` }],
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 9,
              fontWeight: "900",
            }}
          >
            TRUCK
          </Text>
          <View
            style={{
              position: "absolute",
              left: 8,
              bottom: -4,
              width: 10,
              height: 5,
              borderRadius: 999,
              backgroundColor: "#111827",
            }}
          />

          <View
            style={{
              position: "absolute",
              right: 8,
              bottom: -4,
              width: 10,
              height: 5,
              borderRadius: 999,
              backgroundColor: "#111827",
            }}
          />
        </View>

        {/* Labels */}
        <View
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 999,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#cbd5e1",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "900",
              color: "#334155",
            }}
          >
            {backingSide === "left"
              ? "Left-side backing"
              : "Right-side backing"}
          </Text>
        </View>

        <View
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 999,
            backgroundColor: "#eff6ff",
            borderWidth: 1,
            borderColor: "#93c5fd",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "900",
              color: "#1d4ed8",
            }}
          >
            {getStepLabel(stepIndex)}
          </Text>
        </View>

        <Text
          style={{
            position: "absolute",
            left: 12,
            bottom: 8,
            fontSize: 10,
            fontWeight: "800",
            color: "#64748b",
          }}
        >
          Road / driving lane
        </Text>
      </View>
    </View>
  );
}
