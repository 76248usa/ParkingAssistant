import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ParkingType } from "../constants/parkingGuidance";
import { SiteObstacle } from "./SiteObstacleSelector";

type ChecklistItem = {
  id: string;
  label: string;
  detail: string;
};

type Props = {
  parkingType: ParkingType;
  obstacles: SiteObstacle[];
};

function getChecklistItems(
  parkingType: ParkingType,
  obstacles: SiteObstacle[],
): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: "mirrors",
      label: "Mirrors adjusted",
      detail: "Both mirrors give a clear view of the trailer sides.",
    },
    {
      id: "path",
      label:
        parkingType === "pull-through"
          ? "Pull-through path checked"
          : "Campsite entrance checked",
      detail:
        parkingType === "pull-through"
          ? "Entry path, exit path, and trailer swing are clear."
          : "Entrance, road edge, and trailer path are clear.",
    },
    {
      id: "goal",
      label: "Get out and look completed",
      detail: "You checked the site from outside the truck before moving.",
    },
    {
      id: "clearance",
      label: "Roof and rear clearance checked",
      detail: "A/C, roof, ladder, rear bumper, and trees are clear.",
    },
  ];

  if (obstacles.length > 0) {
    items.push({
      id: "obstacles",
      label: "Selected obstacles checked",
      detail: "Poles, trees, branches, hookups, and tight areas were reviewed.",
    });
  }

  items.push({
    id: "spotter",
    label: "Spotter plan agreed, if available",
    detail: "Use clear hand signals or phone communication before moving.",
  });

  return items;
}

export function ReadyToBackChecklistCard({ parkingType, obstacles }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const checklistItems = getChecklistItems(parkingType, obstacles);
  const checkedCount = checkedItems.length;
  const totalCount = checklistItems.length;
  const isComplete = checkedCount === totalCount;

  function toggleChecked(itemId: string) {
    if (checkedItems.includes(itemId)) {
      setCheckedItems(checkedItems.filter((id) => id !== itemId));
      return;
    }

    setCheckedItems([...checkedItems, itemId]);
  }

  function resetChecklist() {
    setCheckedItems([]);
  }

  return (
    <View
      style={{
        marginTop: 12,
        borderRadius: 16,
        backgroundColor: isComplete ? "#dcfce7" : "#f8fafc",
        borderWidth: 1,
        borderColor: isComplete ? "#22c55e" : "#cbd5e1",
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={() => setExpanded((current) => !current)}
        activeOpacity={0.85}
        style={{
          padding: 14,
          backgroundColor: isComplete ? "#dcfce7" : "#f8fafc",
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
                color: isComplete ? "#166534" : "#334155",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Ready to Back Checklist
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
              {isComplete
                ? "Ready to move slowly"
                : `${checkedCount} of ${totalCount} safety checks complete`}
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 12,
                fontWeight: "700",
                color: isComplete ? "#166534" : "#64748b",
                lineHeight: 17,
              }}
            >
              {isComplete
                ? "All checks marked complete. Continue slowly and stop if anything changes."
                : "Tap to review before moving the RV."}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "900",
              color: isComplete ? "#166534" : "#334155",
            }}
          >
            {expanded ? "⌃" : "⌄"}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded ? (
        <View style={{ padding: 14, paddingTop: 0 }}>
          {checklistItems.map((item) => {
            const checked = checkedItems.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleChecked(item.id)}
                activeOpacity={0.85}
                style={{
                  marginTop: 10,
                  padding: 12,
                  borderRadius: 14,
                  backgroundColor: checked ? "#ecfdf5" : "white",
                  borderWidth: 1,
                  borderColor: checked ? "#22c55e" : "#e2e8f0",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "900",
                      color: checked ? "#16a34a" : "#94a3b8",
                    }}
                  >
                    {checked ? "✓" : "○"}
                  </Text>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "900",
                        color: "#0f172a",
                        lineHeight: 18,
                      }}
                    >
                      {item.label}
                    </Text>

                    <Text
                      style={{
                        marginTop: 3,
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#64748b",
                        lineHeight: 17,
                      }}
                    >
                      {item.detail}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {checkedCount > 0 ? (
            <TouchableOpacity
              onPress={resetChecklist}
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 12,
                backgroundColor: "#fee2e2",
                borderWidth: 1,
                borderColor: "#fecaca",
              }}
            >
              <Text
                style={{
                  color: "#991b1b",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: "900",
                }}
              >
                Reset checklist
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
