import * as Speech from "expo-speech";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ParkingType } from "../constants/parkingGuidance";
import { CampsiteType } from "./CampsiteSetupCard";
import { SiteObstacle } from "./SiteObstacleSelector";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  parkingType: ParkingType;
  stepIndex: number;
  backingSide: "left" | "right";
  campsiteType: CampsiteType;
  obstacles: SiteObstacle[];
  scenario: Scenario;
  voiceEnabled: boolean;
};

function getSideMirror(backingSide: "left" | "right") {
  return backingSide === "left" ? "left mirror" : "right mirror";
}

function getCampsiteLabel(campsiteType: CampsiteType) {
  if (campsiteType === "straightBackIn") return "straight back-in campsite";
  if (campsiteType === "angledSite") return "angled campsite";
  if (campsiteType === "tightCampgroundRoad") return "tight campground road";
  return "narrow driveway";
}

function getStepMove(
  parkingType: ParkingType,
  stepIndex: number,
  backingSide: "left" | "right",
  campsiteType: CampsiteType,
  scenario: Scenario,
) {
  if (parkingType === "pull-through") {
    if (stepIndex === 0) {
      return {
        move: "Line up straight with the pull-through lane. Move forward slowly and keep the trailer centered before entering.",
        watch:
          "Watch both sides of the trailer, roof clearance, rear swing, and any posts, trees, hookups, or picnic tables near the lane.",
        reset:
          "If the entry angle does not look right, stop before entering farther. Straighten the truck and trailer, then continue forward slowly.",
      };
    }

    if (stepIndex === 1) {
      return {
        move: "Pull forward slowly into the site. Keep the truck and trailer as straight as possible.",
        watch:
          "Watch both mirrors and the rear trailer swing. Make sure the trailer is not drifting toward poles, trees, or hookups.",
        reset:
          "If the trailer is too close to one side, stop, straighten the rig, and reposition before continuing forward.",
      };
    }

    if (stepIndex === 2) {
      return {
        move: "Continue forward in small movements. Stay centered and avoid sharp steering corrections.",
        watch:
          "Check both sides, roof clearance, and the rear of the trailer. Watch for the trailer cutting close on the inside of the turn.",
        reset:
          "Stop if the path feels tight. Straighten the truck and trailer, check both sides, then continue only when the lane is clear.",
      };
    }

    if (stepIndex === 3) {
      return {
        move: "Ease forward until the trailer is positioned where you want it in the pull-through site.",
        watch:
          "Watch slide-out space, hookups, walking room, roof clearance, and rear clearance before stopping.",
        reset:
          "If the trailer is not centered, pull forward or reposition slowly rather than forcing the final position.",
      };
    }

    return {
      move: "Stop and check the final position. Confirm the trailer is centered and clear on both sides.",
      watch:
        "Check slides, hookups, roof clearance, rear clearance, walking space, and whether the truck can exit safely.",
      reset:
        "If the trailer is not positioned well, reposition with one slow controlled correction.",
    };
  }

  const mirror = getSideMirror(backingSide);
  const campsiteLabel = getCampsiteLabel(campsiteType);

  if (stepIndex === 0) {
    return {
      move: `Set up beside the ${campsiteLabel}. Keep the rig slow, straight, and positioned so the trailer can turn into the space.`,
      watch:
        "Before backing, check both mirrors, the campsite entrance, roof clearance, and the rear corner of the trailer.",
      reset:
        "If the setup does not look right, pull forward and reset before starting the turn.",
    };
  }

  if (stepIndex === 1) {
    if (campsiteType === "tightCampgroundRoad") {
      return {
        move: "Begin the turn with very small steering input. Do not use a big steering swing because the truck may run out of room on a tight road.",
        watch: `Watch the trailer in the ${mirror}. If the trailer angle gets sharp, stop early and pull forward.`,
        reset:
          "On a tight road, an early pull-forward reset is safer than trying to force the trailer into the site.",
      };
    }

    if (campsiteType === "angledSite") {
      return {
        move: "Begin the turn slowly and let the trailer follow the angle of the campsite entrance. Do not try to make it straight too soon.",
        watch: `Watch the trailer in the ${mirror}. The trailer should enter along the site angle before you straighten.`,
        reset:
          "If the trailer cuts across the entrance, pull forward and restart the turn a little later.",
      };
    }

    if (campsiteType === "narrowDriveway") {
      return {
        move: "Start the turn with very small steering corrections. Keep the trailer centered in the driveway entrance.",
        watch:
          "Watch both sides closely. Stop often if clearance is close, especially near fences, posts, or walls.",
        reset:
          "If the trailer drifts off center, pull forward until nearly straight and restart slowly.",
      };
    }

    return {
      move: "Start the backing turn slowly. Let the trailer begin moving toward the parking space before making more steering correction.",
      watch: `Watch the trailer in the ${mirror}. The trailer should start pointing toward the center of the space.`,
      reset:
        "If the trailer angle builds too fast, stop and pull forward before it becomes hard to recover.",
    };
  }

  if (stepIndex === 2) {
    if (campsiteType === "tightCampgroundRoad") {
      return {
        move: "Follow the trailer with small corrections. Keep the truck from swinging too far across the road.",
        watch:
          "Watch the truck front corner and the trailer angle. If either feels tight, stop and pull forward early.",
        reset:
          "Do not wait until the angle is severe. Reset while you still have road space.",
      };
    }

    if (campsiteType === "angledSite") {
      return {
        move: "Let the trailer continue following the campsite angle. Begin straightening gradually only after the trailer is entering the site.",
        watch:
          "Do not force the trailer straight too early. It should follow the entrance angle first, then center up.",
        reset:
          "If the trailer misses the angle, pull forward and restart with a smoother, later turn.",
      };
    }

    if (campsiteType === "narrowDriveway") {
      return {
        move: "Keep the trailer centered and use very small corrections. Avoid chasing the trailer with large steering moves.",
        watch:
          "Check both sides and the rear of the trailer. Stop if the trailer is drifting toward one side.",
        reset:
          "Pull forward to straighten if the trailer is not centered. Do not try to fix a bad angle while still backing.",
      };
    }

    return {
      move: "Follow the trailer into the parking space. Start reducing steering input as the trailer points into the site.",
      watch:
        "Watch the trailer tires and rear corner. The trailer should be entering the parking space, not sliding past it.",
      reset:
        "If the trailer is not entering the space, pull forward and restart the turn slightly later.",
    };
  }

  if (stepIndex === 3) {
    if (campsiteType === "angledSite") {
      return {
        move: "Straighten gradually as the trailer lines up with the angled campsite. Keep small corrections only.",
        watch:
          "The trailer should now be mostly inside the entrance. Avoid over-correcting and swinging the front of the truck too far.",
        reset:
          "If the trailer is angled too sharply, pull forward and reduce the angle before backing again.",
      };
    }

    if (campsiteType === "tightCampgroundRoad") {
      return {
        move: "Straighten the wheel and let the rig settle. Use a pull-forward if the truck is running out of swing room.",
        watch:
          "Watch the front of the truck and both trailer corners. Tight roads leave little room for late correction.",
        reset:
          "Pull forward early if the truck or trailer is crowding either side.",
      };
    }

    return {
      move: "Straighten the wheel and let the trailer come in line with the parking space.",
      watch:
        "Watch both mirrors. The trailer should be mostly inside the space and starting to center.",
      reset:
        "If the trailer is crooked, pull forward with the wheel near straight and reset the angle.",
    };
  }

  return {
    move: "Stop and check the final position. Confirm the trailer is centered, level enough, and clear of obstacles.",
    watch:
      "Check slides, hookups, roof clearance, rear clearance, and walking space before unhitching.",
    reset:
      "If the trailer is not positioned well, pull forward and make one controlled correction rather than forcing the final few feet.",
  };
}

function getObstacleWatch(parkingType: ParkingType, obstacles: SiteObstacle[]) {
  const warnings: string[] = [];

  if (obstacles.includes("poleRight")) {
    warnings.push(
      parkingType === "pull-through"
        ? "Pole right: keep extra clearance on the right side while pulling through."
        : "Pole right: keep extra clearance on the right side and check the right mirror.",
    );
  }

  if (obstacles.includes("treeLeft")) {
    warnings.push(
      parkingType === "pull-through"
        ? "Tree left: keep extra clearance on the left side while pulling through."
        : "Tree left: keep the trailer shallow and check the left mirror.",
    );
  }

  if (obstacles.includes("lowBranch")) {
    warnings.push(
      parkingType === "pull-through"
        ? "Low branch: confirm roof and A/C clearance before moving forward farther."
        : "Low branch: confirm roof and A/C clearance before backing farther.",
    );
  }

  if (obstacles.includes("tightHookupSide")) {
    warnings.push(
      "Hookup side: leave room for slides, hookups, and walking space.",
    );
  }

  if (warnings.length === 0) {
    return "No specific obstacle selected. Still stop and check if anything feels close.";
  }

  return warnings.join(" ");
}

function getScenarioReminder(parkingType: ParkingType, scenario: Scenario) {
  if (parkingType === "pull-through") {
    if (scenario === "easy") {
      return "Easy pull-through: stay centered and move slowly.";
    }

    if (scenario === "tight") {
      return "Tight pull-through: use small steering changes and stop early if either side gets close.";
    }

    return "Normal pull-through: keep the rig straight, slow, and centered.";
  }

  if (scenario === "easy") {
    return "Easy site: keep movements slow and smooth. Use this to build a clean setup.";
  }

  if (scenario === "tight") {
    return "Tight site: use smaller steering corrections and pull forward earlier than usual.";
  }

  return "Normal site: keep the trailer moving slowly and correct early.";
}

export function SmartNextMoveCard({
  parkingType,
  stepIndex,
  backingSide,
  campsiteType,
  obstacles,
  scenario,
  voiceEnabled,
}: Props) {
  const advice = getStepMove(
    parkingType,
    stepIndex,
    backingSide,
    campsiteType,
    scenario,
  );
  const obstacleWatch = getObstacleWatch(parkingType, obstacles);
  const scenarioReminder = getScenarioReminder(parkingType, scenario);

  function readSmartNextMove() {
    const message = `Smart next move. ${advice.move} Watch. ${advice.watch} ${obstacleWatch} Safe reset. ${advice.reset}`;

    if (!voiceEnabled) return;

    Speech.stop();
    Speech.speak(message, {
      language: "en-US",
      rate: 0.9,
      pitch: 1.0,
    });
  }

  return (
    <View
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#ecfdf5",
        borderWidth: 1,
        borderColor: "#86efac",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: "#166534",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Smart Next Move
      </Text>

      <TouchableOpacity
        onPress={readSmartNextMove}
        disabled={!voiceEnabled}
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 12,
          backgroundColor: voiceEnabled ? "#0f172a" : "#94a3b8",
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
          🔊 Read Smart Next Move
        </Text>
      </TouchableOpacity>

      {!voiceEnabled ? (
        <Text
          style={{
            marginTop: 6,
            fontSize: 11,
            fontWeight: "800",
            color: "#64748b",
            textAlign: "center",
          }}
        >
          Voice is off. Turn voice on to hear this coaching.
        </Text>
      ) : null}

      <View
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 14,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#bbf7d0",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "900",
            color: "#15803d",
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Next Move
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: "800",
            color: "#0f172a",
            lineHeight: 20,
          }}
        >
          {advice.move}
        </Text>
      </View>

      <View
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 14,
          backgroundColor: "#f8fafc",
          borderWidth: 1,
          borderColor: "#d1fae5",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "900",
            color: "#0f766e",
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
            color: "#0f172a",
            lineHeight: 19,
          }}
        >
          {advice.watch}
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
            fontWeight: "700",
            color: "#475569",
            lineHeight: 18,
          }}
        >
          {obstacleWatch}
        </Text>
      </View>

      <View
        style={{
          marginTop: 10,
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
            color: "#c2410c",
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
            color: "#0f172a",
            lineHeight: 19,
          }}
        >
          {advice.reset}
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 12,
            fontWeight: "800",
            color: "#92400e",
            lineHeight: 17,
          }}
        >
          {scenarioReminder}
        </Text>
      </View>
    </View>
  );
}
