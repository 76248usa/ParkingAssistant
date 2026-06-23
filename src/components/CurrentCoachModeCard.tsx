import React from "react";
import { Text, View } from "react-native";
import { ParkingType } from "../constants/parkingGuidance";
import { CampsiteType } from "./CampsiteSetupCard";
import { SiteObstacle } from "./SiteObstacleSelector";

type Scenario = "easy" | "normal" | "tight";

type Props = {
  parkingType: ParkingType;
  backingSide: "left" | "right";
  campsiteType: CampsiteType;
  obstacles: SiteObstacle[];
  scenario: Scenario;
};

function getParkingTypeLabel(parkingType: ParkingType) {
  if (parkingType === "back-in") return "Back-in";
  if (parkingType === "pull-through") return "Pull-through";
  return "Parking";
}

function getBackingSideLabel(backingSide: "left" | "right") {
  return backingSide === "left" ? "Left-side" : "Right-side";
}

function getCampsiteLabel(campsiteType: CampsiteType) {
  if (campsiteType === "straightBackIn") return "Straight back-in";
  if (campsiteType === "angledSite") return "Angled site";
  if (campsiteType === "tightCampgroundRoad") return "Tight road";
  return "Narrow driveway";
}

function getScenarioLabel(scenario: Scenario) {
  if (scenario === "easy") return "Easy";
  if (scenario === "tight") return "Tight";
  return "Normal";
}

function getObstacleSummary(obstacles: SiteObstacle[]) {
  if (obstacles.length === 0) return "No obstacles";

  const labels: string[] = [];

  if (obstacles.includes("poleRight")) labels.push("Pole right");
  if (obstacles.includes("treeLeft")) labels.push("Tree left");
  if (obstacles.includes("lowBranch")) labels.push("Low branch");
  if (obstacles.includes("tightHookupSide")) labels.push("Hookup side");

  return labels.join(" • ");
}

export function CurrentCoachModeCard({
  parkingType,
  backingSide,
  campsiteType,
  obstacles,
  scenario,
}: Props) {
  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#eef2ff",
        borderWidth: 1,
        borderColor: "#c7d2fe",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: "#3730a3",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Smart Coach Active
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 14,
          fontWeight: "900",
          color: "#0f172a",
          lineHeight: 19,
        }}
      >
        {parkingType === "pull-through"
          ? `${getParkingTypeLabel(parkingType)} • Drive-through guidance`
          : `${getParkingTypeLabel(parkingType)} • ${getBackingSideLabel(
              backingSide,
            )} • ${getCampsiteLabel(campsiteType)}`}
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          fontWeight: "800",
          color: "#475569",
          lineHeight: 17,
        }}
      >
        {getScenarioLabel(scenario)} difficulty •{" "}
        {getObstacleSummary(obstacles)}
      </Text>
    </View>
  );
}
