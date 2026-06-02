import { Text, TextInput } from "react-native";

type Props = {
  truckLength: string;
  trailerLength: string;
  totalLength: number;
  setTruckLength: (value: string) => void;
  setTrailerLength: (value: string) => void;
};

export function RigSetupCard({
  truckLength,
  trailerLength,
  totalLength,
  setTruckLength,
  setTrailerLength,
}: Props) {
  return (
    <>
      <Text style={{ marginTop: 20 }}>Truck length</Text>

      <TextInput
        value={truckLength}
        onChangeText={setTruckLength}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginTop: 10,
          borderRadius: 8,
          backgroundColor: "white",
        }}
      />

      <Text style={{ marginTop: 20 }}>Trailer length</Text>

      <TextInput
        value={trailerLength}
        onChangeText={setTrailerLength}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginTop: 10,
          borderRadius: 8,
          backgroundColor: "white",
        }}
      />

      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Total rig length: {totalLength} ft
      </Text>
    </>
  );
}
