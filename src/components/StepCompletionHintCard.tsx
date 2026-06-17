import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  stepIndex: number;
  totalSteps: number;
  jackknifeAutoStopActive: boolean;
  isRecoveringFromJackknife: boolean;
  recoveryComplete: boolean;
  onNextStep: () => void;
};

export function StepCompletionHintCard({
  stepIndex,
  totalSteps,
  jackknifeAutoStopActive,
  isRecoveringFromJackknife,
  recoveryComplete,
  onNextStep,
}: Props) {
  const isFinalStep = stepIndex === totalSteps - 1;
  const canContinue =
    !isFinalStep && !jackknifeAutoStopActive && !isRecoveringFromJackknife;

  let title = "Practice this step";
  let message =
    "Use the practice controls below. When the rig looks stable and under control, press Continue to Next Step.";
  let buttonText = "Continue to Next Step";

  let backgroundColor = "#eff6ff";
  let borderColor = "#93c5fd";
  let titleColor = "#1d4ed8";
  let buttonColor = "#2563eb";

  if (jackknifeAutoStopActive) {
    title = "Do not continue yet";
    message =
      "The trailer angle is unsafe. Pull forward first until Recovery Complete appears.";
    buttonText = "Recovery Required";

    backgroundColor = "#fee2e2";
    borderColor = "#fca5a5";
    titleColor = "#b91c1c";
    buttonColor = "#991b1b";
  } else if (isRecoveringFromJackknife) {
    title = "Recovery in progress";
    message =
      "Keep pulling forward slowly until the trailer straightens and Recovery Complete appears.";
    buttonText = "Keep Recovering";

    backgroundColor = "#fff7ed";
    borderColor = "#fdba74";
    titleColor = "#c2410c";
    buttonColor = "#c2410c";
  } else if (recoveryComplete) {
    title = "Ready to continue";
    message =
      "Recovery is complete. You may resume backing slowly or press Continue to Next Step.";
    buttonText = "Continue to Next Step";

    backgroundColor = "#dcfce7";
    borderColor = "#86efac";
    titleColor = "#15803d";
    buttonColor = "#16a34a";
  } else if (isFinalStep) {
    title = "Final step";
    message =
      "Finish this practice run, then review your score, session summary, progress trend, and best practice tip.";
    buttonText = "Final Step";

    backgroundColor = "#f8fafc";
    borderColor = "#cbd5e1";
    titleColor = "#0f172a";
    buttonColor = "#64748b";
  }

  return (
    <View
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        backgroundColor,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          color: titleColor,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        What to do next
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 16,
          fontWeight: "900",
          color: titleColor,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          fontWeight: "700",
          color: "#334155",
          lineHeight: 18,
        }}
      >
        {message}
      </Text>

      <TouchableOpacity
        disabled={!canContinue}
        onPress={onNextStep}
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          backgroundColor: canContinue ? buttonColor : "#cbd5e1",
        }}
      >
        <Text
          style={{
            color: canContinue ? "white" : "#64748b",
            textAlign: "center",
            fontSize: 13,
            fontWeight: "900",
          }}
        >
          {buttonText}
        </Text>
      </TouchableOpacity>

      {!canContinue && !isFinalStep ? (
        <Text
          style={{
            marginTop: 8,
            fontSize: 12,
            fontWeight: "700",
            color: "#64748b",
            textAlign: "center",
            lineHeight: 16,
          }}
        >
          Continue is disabled until the rig is safe again.
        </Text>
      ) : null}
    </View>
  );
}
