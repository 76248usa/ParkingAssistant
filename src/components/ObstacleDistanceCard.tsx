import { Text, View } from "react-native";
import {
  BackingSide,
  getClearanceColor,
  getObstacleDistances,
  Scenario,
} from "../utils/obstacleDistance";
import { SiteObstacle } from "./SiteObstacleSelector";

type Props = {
  stepIndex: number;
  backingSide: BackingSide;
  scenario: Scenario;
  obstacles: SiteObstacle[];
  trailerAngle: number;
};

export function ObstacleDistanceCard({
  stepIndex,
  backingSide,
  scenario,
  obstacles,
  trailerAngle,
}: Props) {
  const distances = getObstacleDistances({
    stepIndex,
    backingSide,
    scenario,
    obstacles,
    trailerAngle,
  });

  if (distances.length === 0) {
    return (
      <View
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 14,
          backgroundColor: "#dcfce7",
          borderWidth: 1,
          borderColor: "#22c55e",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "900",
            color: "#14532d",
          }}
        >
          ✅ Obstacle Distance
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            color: "#14532d",
            fontWeight: "600",
          }}
        >
          No obstacles selected. Clearance looks good.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#cbd5e1",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "900",
          color: "#0f172a",
          marginBottom: 8,
        }}
      >
        Distance to Obstacles
      </Text>

      {distances.map((item) => {
        const color = getClearanceColor(item.distance);

        return (
          <View
            key={item.id}
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 12,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#e2e8f0",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "900",
                  color: "#0f172a",
                }}
              >
                {item.emoji} {item.label}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "900",
                  color,
                }}
              >
                {item.distance} ft — {item.clearanceLabel}
              </Text>
            </View>

            <Text
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "#475569",
                fontWeight: "600",
              }}
            >
              {item.note}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
