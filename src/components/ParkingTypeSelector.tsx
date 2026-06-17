import { Text, TouchableOpacity, View } from "react-native";
import { ParkingType } from "../constants/parkingGuidance";

type Props = {
  parkingType: ParkingType;
  selectParkingType: (type: ParkingType) => void;
};

const parkingTypes: {
  label: string;
  value: ParkingType;
  emoji: string;
}[] = [
  {
    label: "Back-in",
    value: "back-in",
    emoji: "↩️",
  },
  {
    label: "Pull-through",
    value: "pull-through",
    emoji: "➡️",
  },
];
export function ParkingTypeSelector({ parkingType, selectParkingType }: Props) {
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
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: "#334155",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 10,
        }}
      >
        Parking Type
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
        }}
      >
        {parkingTypes.map((type) => {
          const isSelected = parkingType === type.value;

          return (
            <TouchableOpacity
              key={type.value}
              onPress={() => selectParkingType(type.value)}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 6,
                borderRadius: 12,
                backgroundColor: isSelected ? "#0f172a" : "#f8fafc",
                borderWidth: 1,
                borderColor: isSelected ? "#0f172a" : "#cbd5e1",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  marginBottom: 2,
                }}
              >
                {type.emoji}
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: "900",
                  color: isSelected ? "white" : "#334155",
                }}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
