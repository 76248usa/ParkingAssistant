import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CampsiteType } from "./CampsiteSetupCard";
import { SiteObstacle } from "./SiteObstacleSelector";

type RecoveryProblem =
  | "angleTooSharp"
  | "tooCloseToPole"
  | "missedEntrance"
  | "needPullForward"
  | "notLiningUp";

type Props = {
  backingSide: "left" | "right";
  obstacles: SiteObstacle[];
  voiceEnabled: boolean;
  campsiteType: CampsiteType;
};

type RecoveryAdvice = {
  title: string;
  shortLabel: string;
  message: string;
  tip: string;
};

function getCampsiteText(campsiteType: CampsiteType) {
  if (campsiteType === "straightBackIn") {
    return "straight back-in campsite";
  }

  if (campsiteType === "angledSite") {
    return "angled campsite";
  }

  if (campsiteType === "tightCampgroundRoad") {
    return "tight campground road";
  }

  return "narrow driveway";
}

function getCampsiteRecoveryTip(campsiteType: CampsiteType) {
  if (campsiteType === "straightBackIn") {
    return "Reset beside the site and keep the trailer aimed toward the center of the parking space.";
  }

  if (campsiteType === "angledSite") {
    return "For an angled campsite, avoid forcing the trailer straight too early. Let it follow the site angle, then straighten gradually.";
  }

  if (campsiteType === "tightCampgroundRoad") {
    return "On a tight road, pull forward earlier and use smaller steering corrections so the truck does not run out of swing room.";
  }

  return "In a narrow driveway, keep the rig as straight as possible and stop often to check both sides.";
}

function getRecoveryAdvice(
  problem: RecoveryProblem,
  backingSide: "left" | "right",
  obstacles: SiteObstacle[],
  campsiteType: CampsiteType,
): RecoveryAdvice {
  const sideText =
    backingSide === "left" ? "left-side backing" : "right-side backing";

  const campsiteText = getCampsiteText(campsiteType);
  const campsiteRecoveryTip = getCampsiteRecoveryTip(campsiteType);

  if (problem === "angleTooSharp") {
    let message = `Stop. Do not keep backing into the ${campsiteText}. Pull forward slowly until the truck and trailer are nearly straight. Then restart the turn with a smaller steering correction.`;

    let tip =
      "A sharp trailer angle gets worse quickly. Pulling forward early is safer than trying to save the turn. " +
      campsiteRecoveryTip;

    if (campsiteType === "tightCampgroundRoad") {
      message =
        "Stop. On a tight campground road, do not try to save a sharp trailer angle. Pull forward earlier, straighten the truck and trailer, and reset before the truck runs out of swing room. Restart with very small steering input.";
      tip =
        "On tight roads, the safest move is an early reset. Small corrections and extra pull-forwards are better than forcing the trailer into the site.";
    }

    if (campsiteType === "angledSite") {
      message =
        "Stop. The trailer angle is getting too sharp for the angled campsite. Pull forward slowly, reduce the angle, and restart so the trailer follows the campsite angle more gradually.";
      tip =
        "For angled sites, do not force the trailer straight too early. Let it follow the entrance angle, then straighten slowly.";
    }

    if (campsiteType === "narrowDriveway") {
      message =
        "Stop. In a narrow driveway, do not continue with a sharp trailer angle. Pull forward until the rig is almost straight, check both sides, and restart with very small steering corrections.";
      tip =
        "In a narrow driveway, clearance matters more than speed. Stop often and get out to look if needed.";
    }

    return {
      title: "Trailer angle too sharp",
      shortLabel: "Angle too sharp",
      message,
      tip,
    };
  }

  if (problem === "tooCloseToPole") {
    const hasPole = obstacles.includes("poleRight");
    const hasTree = obstacles.includes("treeLeft");
    const hasLowBranch = obstacles.includes("lowBranch");
    const hasHookupSide = obstacles.includes("tightHookupSide");

    let obstacleMessage =
      "Stop. Pull forward slowly and create more room on the obstacle side. Restart the turn wider and check both mirrors before backing again.";

    if (hasPole) {
      obstacleMessage =
        "Stop. You selected a pole on the right. Pull forward slowly and reset with more room on the pole side. Restart the turn wider and keep checking the right mirror.";
    } else if (hasTree) {
      obstacleMessage =
        "Stop. You selected a tree on the left. Pull forward slowly and reset with more room on the tree side. Restart with a shallower trailer angle and keep checking the left mirror.";
    } else if (hasLowBranch) {
      obstacleMessage =
        "Stop. You selected a low branch. Do not keep backing until roof clearance is confirmed. Pull forward if needed and get out to check overhead clearance.";
    } else if (hasHookupSide) {
      obstacleMessage =
        "Stop. You selected a tight hookup side. Pull forward slowly and reset so the trailer leaves enough room for hookups, slides, and walking space.";
    }

    return {
      title: "Too close to pole or obstacle",
      shortLabel: "Too close to pole",
      message: obstacleMessage,
      tip:
        "If clearance feels tight, stop and get out to look. Do not rely only on the diagram. " +
        campsiteRecoveryTip,
    };
  }

  if (problem === "missedEntrance") {
    return {
      title: "Missed the campsite entrance",
      shortLabel: "Missed entrance",
      message: `Stop. Pull forward past the entrance enough to straighten the rig. Reset beside the ${campsiteText}, then restart the backing turn later and slower.`,
      tip:
        "If the trailer turns too soon, it cuts across the entrance. If it turns too late, it misses the site. " +
        campsiteRecoveryTip,
    };
  }

  if (problem === "needPullForward") {
    return {
      title: "Need to pull forward",
      shortLabel: "Pull forward",
      message:
        "Pull forward slowly with the wheel close to straight. Watch the trailer come back in line behind the truck. Stop when the rig is straighter, then restart the backing step.",
      tip:
        "Pulling forward is not a mistake. It is the safest way to reset the angle. " +
        campsiteRecoveryTip,
    };
  }
  if (problem === "notLiningUp") {
    if (campsiteType === "angledSite") {
      return {
        title: "Trailer not lining up",
        shortLabel: "Not lining up",
        message:
          "Stop and reassess the angled campsite. Pull forward until the trailer is straighter, then restart so the trailer follows the angle of the campsite entrance. Do not force the trailer straight too early. Let it follow the angle first, then straighten gradually.",
        tip: "For angled campsites, aim the trailer along the campsite angle first. Once the trailer is mostly inside the entrance, use small corrections to center it.",
      };
    }

    if (campsiteType === "tightCampgroundRoad") {
      return {
        title: "Trailer not lining up",
        shortLabel: "Not lining up",
        message:
          "Stop and reassess the tight campground road setup. Pull forward earlier before the truck runs out of swing room. Straighten the rig, then restart with very small steering input and aim the trailer into the center of the site.",
        tip: "On tight roads, do not wait too long to reset. Extra pull-forwards are safer than forcing a bad angle.",
      };
    }

    if (campsiteType === "narrowDriveway") {
      return {
        title: "Trailer not lining up",
        shortLabel: "Not lining up",
        message:
          "Stop and reassess the narrow driveway. Pull forward until the truck and trailer are nearly straight. Check both sides, then restart with very small steering corrections and keep the trailer centered in the entrance.",
        tip: "In a narrow driveway, clearance is more important than finishing in one move. Stop often and get out to look.",
      };
    }

    return {
      title: "Trailer not lining up",
      shortLabel: "Not lining up",
      message: `Stop and reassess your ${sideText} into the ${campsiteText}. Pull forward until the trailer is straighter. Restart with smaller steering input and aim the trailer toward the center of the parking space.`,
      tip: campsiteRecoveryTip,
    };
  }
}

export function RecoveryCoachCard({
  backingSide,
  obstacles,
  voiceEnabled,
  campsiteType,
}: Props) {
  const [selectedProblem, setSelectedProblem] =
    useState<RecoveryProblem | null>(null);

  const selectedAdvice = selectedProblem
    ? getRecoveryAdvice(selectedProblem, backingSide, obstacles, campsiteType)
    : null;

  function speakAdvice(message: string) {
    if (!voiceEnabled) return;

    Speech.stop();
    Speech.speak(message, {
      language: "en-US",
      rate: 0.9,
      pitch: 1.0,
    });
  }

  function chooseProblem(problem: RecoveryProblem) {
    const advice = getRecoveryAdvice(
      problem,
      backingSide,
      obstacles,
      campsiteType,
    );

    setSelectedProblem(problem);
    speakAdvice(advice.message);
  }

  const problems: RecoveryProblem[] = [
    "angleTooSharp",
    "tooCloseToPole",
    "missedEntrance",
    "needPullForward",
    "notLiningUp",
  ];

  return (
    <View
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 16,
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
          letterSpacing: 0.5,
        }}
      >
        Recovery Coach
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 14,
          fontWeight: "800",
          color: "#0f172a",
          lineHeight: 19,
        }}
      >
        Tap what is going wrong. RV Assist will give a safe reset instruction.
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 12,
        }}
      >
        {problems.map((problem) => {
          const advice = getRecoveryAdvice(
            problem,
            backingSide,
            obstacles,
            campsiteType,
          );

          const selected = selectedProblem === problem;

          return (
            <TouchableOpacity
              key={problem}
              onPress={() => chooseProblem(problem)}
              style={{
                width: "48%",
                paddingVertical: 10,
                paddingHorizontal: 8,
                borderRadius: 12,
                backgroundColor: selected ? "#ea580c" : "white",
                borderWidth: 1,
                borderColor: selected ? "#ea580c" : "#fed7aa",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: "900",
                  color: selected ? "white" : "#9a3412",
                }}
              >
                {advice.shortLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedAdvice ? (
        <View
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 14,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#fed7aa",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            {selectedAdvice.title}
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: 20,
            }}
          >
            {selectedAdvice.message}
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 13,
              fontWeight: "700",
              color: "#92400e",
              lineHeight: 18,
            }}
          >
            Tip: {selectedAdvice.tip}
          </Text>

          <TouchableOpacity
            onPress={() => speakAdvice(selectedAdvice.message)}
            style={{
              marginTop: 10,
              padding: 10,
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
              🔁 Repeat Recovery Coaching
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
