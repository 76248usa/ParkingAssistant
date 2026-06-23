import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type CampsiteType =
  | "straightBackIn"
  | "angledSite"
  | "tightCampgroundRoad"
  | "narrowDriveway";

type CampsiteOption = {
  id: CampsiteType;
  title: string;
  subtitle: string;
  emoji: string;
};

type Props = {
  campsiteType: CampsiteType;
  setCampsiteType: (type: CampsiteType) => void;
};

const CAMPSITE_OPTIONS: CampsiteOption[] = [
  {
    id: "straightBackIn",
    title: "Straight back-in",
    subtitle: "Normal campsite setup",
    emoji: "⬅️",
  },
  {
    id: "angledSite",
    title: "Angled campsite",
    subtitle: "Site entrance is angled",
    emoji: "↩️",
  },
  {
    id: "tightCampgroundRoad",
    title: "Tight road",
    subtitle: "Limited room to swing",
    emoji: "🚧",
  },
  {
    id: "narrowDriveway",
    title: "Narrow driveway",
    subtitle: "Tight entrance or home driveway",
    emoji: "🏠",
  },
];

function getSelectedOption(campsiteType: CampsiteType) {
  return (
    CAMPSITE_OPTIONS.find((option) => option.id === campsiteType) ??
    CAMPSITE_OPTIONS[0]
  );
}

function getCampsiteCoaching(type: CampsiteType) {
  if (type === "straightBackIn") {
    return "Use a normal setup beside the site. Back slowly, let the trailer start turning, then follow it into the space.";
  }

  if (type === "angledSite") {
    return "Let the trailer follow the angle of the campsite. Avoid turning too sharply at the beginning.";
  }

  if (type === "tightCampgroundRoad") {
    return "Use smaller steering corrections. Pull forward earlier if the trailer angle gets sharp or the truck runs out of room.";
  }

  return "Keep the rig as straight as possible before backing. Use very small corrections and stop often to check clearance.";
}

export function CampsiteSetupCard({ campsiteType, setCampsiteType }: Props) {
  const [expanded, setExpanded] = useState(false);
  const selectedOption = getSelectedOption(campsiteType);

  function chooseCampsiteType(type: CampsiteType) {
    setCampsiteType(type);
    setExpanded(false);
  }

  return (
    <View
      style={{
        marginTop: 12,
        borderRadius: 16,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#cbd5e1",
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={() => setExpanded((current) => !current)}
        activeOpacity={0.85}
        style={{
          padding: 14,
          backgroundColor: "#f8fafc",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "900",
                color: "#334155",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Campsite Setup
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 15,
                fontWeight: "900",
                color: "#0f172a",
                lineHeight: 20,
              }}
            >
              {selectedOption.emoji} {selectedOption.title}
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 12,
                fontWeight: "700",
                color: "#64748b",
                lineHeight: 17,
              }}
            >
              {selectedOption.subtitle}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "900",
              color: "#334155",
            }}
          >
            {expanded ? "⌃" : "⌄"}
          </Text>
        </View>

        <Text
          style={{
            marginTop: 6,
            fontSize: 11,
            fontWeight: "800",
            color: "#64748b",
          }}
        >
          {expanded ? "Tap to hide choices" : "Tap to change"}
        </Text>
      </TouchableOpacity>

      {expanded ? (
        <View
          style={{
            padding: 14,
            paddingTop: 0,
          }}
        >
          <Text
            style={{
              marginTop: 4,
              fontSize: 14,
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: 19,
            }}
          >
            Choose the parking situation so RV Assist can give better guidance.
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12,
            }}
          >
            {CAMPSITE_OPTIONS.map((option) => {
              const selected = campsiteType === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => chooseCampsiteType(option.id)}
                  style={{
                    width: "48%",
                    padding: 10,
                    borderRadius: 14,
                    backgroundColor: selected ? "#0f172a" : "white",
                    borderWidth: 1,
                    borderColor: selected ? "#0f172a" : "#cbd5e1",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                    }}
                  >
                    {option.emoji}
                  </Text>

                  <Text
                    style={{
                      marginTop: 4,
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: "900",
                      color: selected ? "white" : "#0f172a",
                    }}
                  >
                    {option.title}
                  </Text>

                  <Text
                    style={{
                      marginTop: 3,
                      textAlign: "center",
                      fontSize: 10,
                      fontWeight: "700",
                      color: selected ? "#cbd5e1" : "#64748b",
                      lineHeight: 14,
                    }}
                  >
                    {option.subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 14,
              backgroundColor: "#eff6ff",
              borderWidth: 1,
              borderColor: "#bfdbfe",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "900",
                color: "#1d4ed8",
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Setup Coaching
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 13,
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: 18,
              }}
            >
              {getCampsiteCoaching(campsiteType)}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
