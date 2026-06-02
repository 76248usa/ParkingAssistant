import { Text, TouchableOpacity, View } from "react-native";
import { ParkingType, parkingTypes } from "../constants/parkingGuidance";

type Props = {
  parkingType: ParkingType;
  selectParkingType: (type: ParkingType) => void;
};

export function ParkingTypeSelector({ parkingType, selectParkingType }: Props) {
  return (
    <>
      <Text
        style={{
          marginTop: 30,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Parking type
      </Text>

      <View style={{ marginTop: 10, gap: 10 }}>
        {parkingTypes.map((item) => {
          const selected = parkingType === item.value;

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => selectParkingType(item.value)}
              style={{
                padding: 14,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: selected ? "#0891b2" : "#ccc",
                backgroundColor: selected ? "#0891b2" : "white",
              }}
            >
              <Text
                style={{
                  color: selected ? "white" : "#111",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}
