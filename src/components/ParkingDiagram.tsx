import React from "react";
import { Text, View } from "react-native";
import { ParkingType } from "../constants/parkingGuidance";
import { CampsiteType } from "./CampsiteSetupCard";
import { SiteObstacle } from "./SiteObstacleSelector";

type TrailPoint = {
  x: number;
  y: number;
};

type Props = {
  stepIndex: number;
  backingSide: "left" | "right";
  campsiteType: CampsiteType;
  simulatedTruckAngle: number;
  simulatedTrailerAngle: number;
  movementTrail?: TrailPoint[];
  obstacles?: SiteObstacle[];
  parkingType: ParkingType;
};

const CANVAS_WIDTH = 420;
const CANVAS_HEIGHT = 270;

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

type ParkingSpace = {
  left: number;
  top: number;
  width: number;
  height: number;
  rotation: number;
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

function getPose(
  stepIndex: number,
  backingSide: "left" | "right",
  campsiteType: CampsiteType,
) {
  const parkingSpace = getParkingSpace(backingSide, campsiteType);

  const trailerWidth = 76;
  const trailerHeight = 36;
  const truckWidth = 58;
  const truckHeight = 30;

  const siteCenterX = parkingSpace.left + parkingSpace.width / 2;
  const siteCenterY = parkingSpace.top + parkingSpace.height / 2;
  const roadCenterY = 162;

  const finalRotation = backingSide === "right" ? 90 : -90;

  // Which side of the campsite the rig approaches from.
  const approachSide = backingSide === "right" ? -1 : 1;

  // Which side of the trailer the truck should appear on.
  // This is the part that fixes the left-side jump.
  const truckSide = backingSide === "right" ? 1 : -1;

  function fromCenters(
    trailerCenterX: number,
    trailerCenterY: number,
    truckCenterX: number,
    truckCenterY: number,
    trailerRotation: number,
    truckRotation: number,
  ) {
    return {
      trailerLeft: trailerCenterX - trailerWidth / 2,
      trailerTop: trailerCenterY - trailerHeight / 2,
      trailerRotation,
      truckLeft: truckCenterX - truckWidth / 2,
      truckTop: truckCenterY - truckHeight / 2,
      truckRotation,
    };
  }

  function getTruckCenterFromTrailer(
    trailerCenterX: number,
    trailerCenterY: number,
    trailerRotation: number,
  ) {
    const hitchDistance = 96;
    const angleRadians = (trailerRotation * Math.PI) / 180;

    return {
      truckCenterX:
        trailerCenterX + truckSide * Math.cos(angleRadians) * hitchDistance,
      truckCenterY:
        trailerCenterY + truckSide * Math.sin(angleRadians) * hitchDistance,
    };
  }

  if (stepIndex === 0) {
    const trailerCenterX = siteCenterX + approachSide * 118;
    const trailerCenterY = roadCenterY;
    const trailerRotation = 0;

    const { truckCenterX, truckCenterY } = getTruckCenterFromTrailer(
      trailerCenterX,
      trailerCenterY,
      trailerRotation,
    );

    return fromCenters(
      trailerCenterX,
      trailerCenterY,
      truckCenterX,
      truckCenterY,
      trailerRotation,
      0,
    );
  }

  if (stepIndex === 1) {
    const trailerCenterX = siteCenterX + approachSide * 92;
    const trailerCenterY = roadCenterY;
    const trailerRotation = finalRotation * 0.18;

    const { truckCenterX, truckCenterY } = getTruckCenterFromTrailer(
      trailerCenterX,
      trailerCenterY,
      trailerRotation,
    );

    return fromCenters(
      trailerCenterX,
      trailerCenterY,
      truckCenterX,
      truckCenterY,
      trailerRotation,
      trailerRotation * 0.65,
    );
  }

  if (stepIndex === 2) {
    const trailerCenterX = siteCenterX + approachSide * 48;
    const trailerCenterY = siteCenterY + 82;
    const trailerRotation = finalRotation * 0.42;

    const { truckCenterX, truckCenterY } = getTruckCenterFromTrailer(
      trailerCenterX,
      trailerCenterY,
      trailerRotation,
    );

    return fromCenters(
      trailerCenterX,
      trailerCenterY,
      truckCenterX,
      truckCenterY,
      trailerRotation,
      trailerRotation * 0.75,
    );
  }

  if (stepIndex === 3) {
    const trailerCenterX = siteCenterX + approachSide * 22;
    const trailerCenterY = siteCenterY + 48;
    const trailerRotation = finalRotation * 0.72;

    const { truckCenterX, truckCenterY } = getTruckCenterFromTrailer(
      trailerCenterX,
      trailerCenterY,
      trailerRotation,
    );

    return fromCenters(
      trailerCenterX,
      trailerCenterY,
      truckCenterX,
      truckCenterY,
      trailerRotation,
      trailerRotation * 0.8,
    );
  }

  const finalTrailerCenterX = siteCenterX;
  const finalTrailerCenterY = siteCenterY;

  const finalTruckCenterX = siteCenterX;
  const finalTruckCenterY = siteCenterY + 92;

  return fromCenters(
    finalTrailerCenterX,
    finalTrailerCenterY,
    finalTruckCenterX,
    finalTruckCenterY,
    finalRotation,
    finalRotation,
  );
}

function getDiagramStepLabel(parkingType: ParkingType, stepIndex: number) {
  if (parkingType === "pull-through") {
    if (stepIndex === 0) return "Line up with pull-through lane";
    if (stepIndex === 1) return "Pull forward slowly";
    if (stepIndex === 2) return "Stay centered through the site";
    if (stepIndex === 3) return "Ease forward into position";
    return "Stop and check final position";
  }

  if (stepIndex === 0) return "Pull forward past campsite entrance";
  if (stepIndex === 1) return "Trailer axle past entrance — start backing";
  if (stepIndex === 2) return "Rear of trailer turns toward site";
  if (stepIndex === 3) return "Trailer entering site — follow and straighten";
  return "Trailer centered in campsite";
}
function getParkingSpace(
  backingSide: "left" | "right",
  campsiteType: CampsiteType,
) {
  const baseSpace = {
    left: 210,
    top: 46,
    width: PARKING_SPACE_WIDTH,
    height: PARKING_SPACE_HEIGHT,
    rotation: 0,
  };

  const rightSideSpace =
    campsiteType === "angledSite"
      ? {
          left: 236,
          top: 44,
          width: 122,
          height: 82,
          rotation: -10,
        }
      : campsiteType === "tightCampgroundRoad"
        ? {
            left: 232,
            top: 46,
            width: 100,
            height: 82,
            rotation: 0,
          }
        : campsiteType === "narrowDriveway"
          ? {
              left: 248,
              top: 36,
              width: 66,
              height: 106,
              rotation: 0,
            }
          : baseSpace;
  if (backingSide === "right") {
    return rightSideSpace;
  }

  return {
    left: mirrorX(rightSideSpace.left, rightSideSpace.width),
    top: rightSideSpace.top,
    width: rightSideSpace.width,
    height: rightSideSpace.height,
    rotation: -rightSideSpace.rotation,
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
  parkingSpace: ParkingSpace,
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

function getCampsiteDiagramLabel(campsiteType: CampsiteType) {
  if (campsiteType === "straightBackIn") return "Straight back-in";
  if (campsiteType === "angledSite") return "Angled campsite";
  if (campsiteType === "tightCampgroundRoad") return "Tight road";
  return "Narrow driveway";
}

function getTargetLabel(campsiteType: CampsiteType) {
  if (campsiteType === "narrowDriveway") return "DRIVEWAY";
  return "TARGET";
}

function getRoadStyle(campsiteType: CampsiteType) {
  if (campsiteType === "tightCampgroundRoad") {
    return {
      top: 134,
      height: 44,
      label: "Tight road / limited swing room",
    };
  }

  if (campsiteType === "narrowDriveway") {
    return {
      top: 132,
      height: 46,
      label: "Narrow driveway approach",
    };
  }

  return {
    top: 124,
    height: 58,
    label: "Road / driving lane",
  };
}

export function ParkingDiagram({
  stepIndex,
  backingSide,
  campsiteType,
  simulatedTruckAngle,
  simulatedTrailerAngle,
  movementTrail = [],
  obstacles = [],
  parkingType,
}: Props) {
  if (parkingType === "pull-through") {
    return (
      <View
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 16,
          backgroundColor: "#f8fafc",
          borderWidth: 1,
          borderColor: "#cbd5e1",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "900",
            color: "#334155",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Pull-through path
        </Text>

        <View
          style={{
            marginTop: 10,
            height: 190,
            borderRadius: 14,
            backgroundColor: "#dcfce7",
            borderWidth: 1,
            borderColor: "#86efac",
            overflow: "hidden",
          }}
        >
          {/* Pull-through lane */}
          <View
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              top: 70,
              height: 54,
              borderRadius: 18,
              backgroundColor: "#94a3b8",
            }}
          />

          {/* Lane center line */}
          <View
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              top: 96,
              height: 2,
              backgroundColor: "white",
              opacity: 0.9,
            }}
          />

          {/* Campsite / pull-through area */}
          <View
            style={{
              position: "absolute",
              left: 210,
              top: 42,
              width: 120,
              height: 110,
              borderRadius: 14,
              backgroundColor: "#bbf7d0",
              borderWidth: 2,
              borderColor: "#16a34a",
              borderStyle: "dashed",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "900",
                color: "#166534",
                textAlign: "center",
              }}
            >
              PULL-THROUGH SITE
            </Text>
          </View>

          {/* Direction arrow */}
          <Text
            style={{
              position: "absolute",
              left: 42,
              top: 42,
              fontSize: 13,
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            Enter →
          </Text>

          <Text
            style={{
              position: "absolute",
              right: 32,
              top: 154,
              fontSize: 13,
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            Exit →
          </Text>

          {/* Trailer */}
          <View
            style={{
              position: "absolute",
              left: stepIndex >= 2 ? 198 : stepIndex === 1 ? 150 : 92,
              top: 78,
              width: 76,
              height: 36,
              borderRadius: 8,
              backgroundColor: "#f8fafc",
              borderWidth: 2,
              borderColor: "#334155",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 30,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "900",
                color: "#0f172a",
              }}
            >
              Trailer
            </Text>
          </View>

          {/* Truck */}
          <View
            style={{
              position: "absolute",
              left: stepIndex >= 2 ? 274 : stepIndex === 1 ? 226 : 168,
              top: 81,
              width: 58,
              height: 30,
              borderRadius: 8,
              backgroundColor: "#1d4ed8",
              borderWidth: 2,
              borderColor: "#1e3a8a",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 30,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "900",
                color: "white",
              }}
            >
              Truck
            </Text>
          </View>

          {/* Pull-through coaching label */}
          <View
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 10,
              padding: 8,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderWidth: 1,
              borderColor: "#bbf7d0",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                color: "#166534",
                textAlign: "center",
                lineHeight: 15,
              }}
            >
              Pull forward slowly. Stay centered and watch both trailer sides.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const pose = getPose(stepIndex, backingSide, campsiteType);
  const roadStyle = getRoadStyle(campsiteType);
  const parkingSpace = getParkingSpace(backingSide, campsiteType);
  const guideDots = getGuideDots(backingSide);
  const obstacleItems = getObstacleElements(obstacles, parkingSpace);

  const trailerRotation = pose.trailerRotation + simulatedTrailerAngle * 0.35;
  const truckRotation = pose.truckRotation + simulatedTruckAngle * 0.35;
  // const canvasHeight = drivingView
  //   ? DRIVING_CANVAS_HEIGHT
  //   : NORMAL_CANVAS_HEIGHT;
  return (
    <View
      style={{
        marginTop: 12,
        alignItems: "center",
      }}
    >
      {/* Diagram step label - outside the canvas so it does not cover the campsite */}
      <View
        style={{
          width: "100%",
          maxWidth: CANVAS_WIDTH,
          marginBottom: 6,
          paddingVertical: 7,
          paddingHorizontal: 10,
          borderRadius: 999,
          backgroundColor: "#0f172a",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 11,
            fontWeight: "900",
            textAlign: "center",
          }}
        >
          {getDiagramStepLabel(parkingType, stepIndex)}
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          maxWidth: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
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
            top: roadStyle.top,
            width: CANVAS_WIDTH,
            height: roadStyle.height,
            backgroundColor:
              campsiteType === "tightCampgroundRoad" ||
              campsiteType === "narrowDriveway"
                ? "#d1d5db"
                : "#e5e7eb",
          }}
        />
        {campsiteType === "tightCampgroundRoad" ? (
          <>
            <View
              style={{
                position: "absolute",
                left: 0,
                top: roadStyle.top - 2,
                width: CANVAS_WIDTH,
                height: 3,
                backgroundColor: "#94a3b8",
              }}
            />

            <View
              style={{
                position: "absolute",
                left: 0,
                top: roadStyle.top + roadStyle.height,
                width: CANVAS_WIDTH,
                height: 3,
                backgroundColor: "#94a3b8",
              }}
            />

            <Text
              style={{
                position: "absolute",
                left: 12,
                top: roadStyle.top + 6,
                fontSize: 10,
                fontWeight: "900",
                color: "#475569",
              }}
            >
              Limited swing room
            </Text>
          </>
        ) : null}
        {/* Road lane line */}
        <View
          style={{
            position: "absolute",
            left: 0,
            top: roadStyle.top + roadStyle.height / 2,
            width: CANVAS_WIDTH,
            height: 2,
            backgroundColor: "#ffffff",
            opacity: 0.9,
          }}
        />
        {/* Road lane line */}
        <View
          style={{
            position: "absolute",
            left: 0,
            top: roadStyle.top + roadStyle.height / 2,
            width: CANVAS_WIDTH,
            height: 2,
            backgroundColor: "#ffffff",
            opacity: 0.9,
          }}
        />
        {/* Parking target */}
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
            justifyContent: "flex-start",
            alignItems: "center",
            transform: [{ rotate: `${parkingSpace.rotation}deg` }],
          }}
        >
          <Text
            style={{
              marginTop: campsiteType === "narrowDriveway" ? 12 : 10,
              fontSize: campsiteType === "narrowDriveway" ? 9 : 10,
              fontWeight: "900",
              textAlign: "center",
              color: "#166534",
            }}
          >
            {getTargetLabel(campsiteType)}
          </Text>
        </View>

        {/* Parking target center guide */}
        <View
          style={{
            position: "absolute",
            left: parkingSpace.left + parkingSpace.width / 2 - 1,
            top: parkingSpace.top + 18,
            width: 2,
            height: parkingSpace.height - 28,
            backgroundColor: "#86efac",
            transform: [{ rotate: `${parkingSpace.rotation}deg` }],
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
        {/* Hitch position marker */}
        <View
          style={{
            position: "absolute",
            left: (pose.trailerLeft + pose.truckLeft) / 2 + 34,
            top: (pose.trailerTop + pose.truckTop) / 2 + 16,
            width: 12,
            height: 12,
            borderRadius: 6,

            backgroundColor: "#475569",
            borderWidth: 2,
            borderColor: "white",
            zIndex: 50,
            elevation: 50,
          }}
        />
        {/* Backing side label */}
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
        {/* Campsite type label */}
        <View
          style={{
            position: "absolute",
            left: 10,
            top: 42,
            paddingVertical: 5,
            paddingHorizontal: 9,
            borderRadius: 999,
            backgroundColor: "#fefce8",
            borderWidth: 1,
            borderColor: "#fde68a",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "900",
              color: "#854d0e",
            }}
          >
            {getCampsiteDiagramLabel(campsiteType)}
          </Text>
        </View>
        {/* Step label */}
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
          {roadStyle.label}
        </Text>
      </View>
    </View>
  );
}
