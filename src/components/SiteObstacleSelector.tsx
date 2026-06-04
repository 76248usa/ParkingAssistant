import { Pressable, Text, View } from "react-native";

export type SiteObstacle =
  | "treeLeft"
  | "poleRight"
  | "lowBranch"
  | "tightHookupSide";

type Props = {
  obstacles: SiteObstacle[];
  setObstacles: (obstacles: SiteObstacle[]) => void;
};

const OPTIONS: { id: SiteObstacle; label: string }[] = [
  { id: "treeLeft", label: "Tree on left" },
  { id: "poleRight", label: "Pole on right" },
  { id: "lowBranch", label: "Low branch" },
  { id: "tightHookupSide", label: "Tight hookup side" },
];

export function SiteObstacleSelector({ obstacles, setObstacles }: Props) {
  function toggleObstacle(id: SiteObstacle) {
    if (obstacles.includes(id)) {
      setObstacles(obstacles.filter((item) => item !== id));
    } else {
      setObstacles([...obstacles, id]);
    }
  }

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
        Site Obstacles
      </Text>

      <Text style={{ color: "#555", marginBottom: 10 }}>
        Select anything that makes the campsite harder.
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {OPTIONS.map((option) => {
          const selected = obstacles.includes(option.id);

          return (
            <Pressable
              key={option.id}
              onPress={() => toggleObstacle(option.id)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selected ? "#111" : "#ccc",
                backgroundColor: selected ? "#111" : "#fff",
              }}
            >
              <Text
                style={{
                  color: selected ? "#fff" : "#111",
                  fontWeight: "600",
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
