import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HOW_TO_USE_STORAGE_KEY = "rvAssistHowToUseClosed";

export function HowToUseCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadClosedState() {
      try {
        const savedValue = await AsyncStorage.getItem(HOW_TO_USE_STORAGE_KEY);

        if (!mounted) return;

        if (savedValue === "true") {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } catch (error) {
        console.warn("Failed to load how-to-use state", error);
        setIsVisible(true);
      }
    }

    loadClosedState();

    return () => {
      mounted = false;
    };
  }, []);

  async function closeCard() {
    try {
      await AsyncStorage.setItem(HOW_TO_USE_STORAGE_KEY, "true");
    } catch (error) {
      console.warn("Failed to save how-to-use state", error);
    }

    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <View
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#eff6ff",
        borderWidth: 1,
        borderColor: "#93c5fd",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: "#1d4ed8",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        How to Use RV Assist
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: "900",
          color: "#0f172a",
          lineHeight: 20,
        }}
      >
        1. Confirm your rig setup.{"\n"}
        2. Choose the parking type.{"\n"}
        3. Select any site obstacles.{"\n"}
        4. Read each guidance step.{"\n"}
        5. Watch the steering wheel and simulator.{"\n"}
        6. Tap Next when ready for the next step.
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 12,
          fontWeight: "700",
          color: "#475569",
          lineHeight: 17,
        }}
      >
        This version gives step-by-step visual coaching. It does not control or
        park the RV for you.
      </Text>

      <TouchableOpacity
        onPress={closeCard}
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          backgroundColor: "#2563eb",
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 14,
            fontWeight: "900",
          }}
        >
          I Understand
        </Text>
      </TouchableOpacity>
    </View>
  );
}
