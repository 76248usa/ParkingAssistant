import { Text, TouchableOpacity, View } from "react-native";

export type SiteObstacle =
  | "treeLeft"
  | "poleRight"
  | "lowBranch"
  | "tightHookupSide";

type Props = {
  obstacles: SiteObstacle[];
  setObstacles: React.Dispatch<React.SetStateAction<SiteObstacle[]>>;
};

const obstacleOptions: {
  label: string;
  shortLabel: string;
  value: SiteObstacle;
  emoji: string;
}[] = [
  {
    label: "Tree on left",
    shortLabel: "Tree left",
    value: "treeLeft",
    emoji: "🌳",
  },
  {
    label: "Pole on right",
    shortLabel: "Pole right",
    value: "poleRight",
    emoji: "🚧",
  },
  {
    label: "Low branch",
    shortLabel: "Low branch",
    value: "lowBranch",
    emoji: "🌿",
  },
  {
    label: "Tight hookup side",
    shortLabel: "Hookup side",
    value: "tightHookupSide",
    emoji: "⚡",
  },
];

export function SiteObstacleSelector({ obstacles, setObstacles }: Props) {
  function toggleObstacle(obstacle: SiteObstacle) {
    setObstacles((current) => {
      if (current.includes(obstacle)) {
        return current.filter((item) => item !== obstacle);
      }

      return [...current, obstacle];
    });
  }

  const selectedCount = obstacles.length;

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#cbd5e1",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
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
          Site Obstacles
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "800",
            color: selectedCount > 0 ? "#b45309" : "#64748b",
          }}
        >
          {selectedCount} selected
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {obstacleOptions.map((option) => {
          const isSelected = obstacles.includes(option.value);

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => toggleObstacle(option.value)}
              style={{
                width: "48%",
                paddingVertical: 10,
                paddingHorizontal: 8,
                borderRadius: 12,
                backgroundColor: isSelected ? "#f97316" : "#f8fafc",
                borderWidth: 1,
                borderColor: isSelected ? "#ea580c" : "#cbd5e1",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  marginBottom: 2,
                }}
              >
                {option.emoji}
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: "900",
                  color: isSelected ? "white" : "#334155",
                }}
              >
                {option.shortLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedCount > 0 ? (
        <Text
          style={{
            marginTop: 10,
            fontSize: 12,
            fontWeight: "700",
            color: "#64748b",
            textAlign: "center",
            lineHeight: 16,
          }}
        >
          Selected obstacles will change the backing warnings and coaching.
        </Text>
      ) : null}
    </View>
  );
}
