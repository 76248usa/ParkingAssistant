export type ClearanceLevel = "safe" | "caution" | "stop";

export type ClearanceItem = {
  key: "left" | "right" | "rear" | "roof";
  label: string;
  value: number | null;
};

export function parseDistance(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const parsed = Number(trimmed);

  if (Number.isNaN(parsed)) return null;

  return parsed;
}

export function getClearanceLevel(value: number | null): ClearanceLevel {
  if (value === null) return "safe";

  if (value <= 18) return "stop";
  if (value <= 36) return "caution";
  return "safe";
}

export function getLevelStyles(level: ClearanceLevel) {
  if (level === "stop") {
    return {
      backgroundColor: "#fee2e2",
      borderColor: "#ef4444",
      textColor: "#991b1b",
      label: "STOP",
      message: "Clearance is too tight. Stop and get out to look.",
    };
  }

  if (level === "caution") {
    return {
      backgroundColor: "#fff7ed",
      borderColor: "#fb923c",
      textColor: "#9a3412",
      label: "CAUTION",
      message: "Clearance is limited. Move slowly and check carefully.",
    };
  }

  return {
    backgroundColor: "#dcfce7",
    borderColor: "#22c55e",
    textColor: "#166534",
    label: "SAFE",
    message: "Clearance looks acceptable. Continue slowly.",
  };
}

export function getSpecificWarningReason(items: ClearanceItem[]) {
  const checkedItems = items.filter((item) => item.value !== null);

  if (checkedItems.length === 0) {
    return "Enter a clearance distance to check for risk.";
  }

  const stopItems = checkedItems.filter(
    (item) => getClearanceLevel(item.value) === "stop",
  );

  if (stopItems.length > 0) {
    const worst = [...stopItems].sort((a, b) => {
      return (a.value ?? 999) - (b.value ?? 999);
    })[0];

    return `${worst.label} is ${worst.value} inches. Stop and get out to look before moving.`;
  }

  const cautionItems = checkedItems.filter(
    (item) => getClearanceLevel(item.value) === "caution",
  );

  if (cautionItems.length > 0) {
    const worst = [...cautionItems].sort((a, b) => {
      return (a.value ?? 999) - (b.value ?? 999);
    })[0];

    return `${worst.label} is ${worst.value} inches. Move slowly and watch that area closely.`;
  }

  const closest = [...checkedItems].sort((a, b) => {
    return (a.value ?? 999) - (b.value ?? 999);
  })[0];

  return `Closest checked clearance is ${closest.label.toLowerCase()} at ${
    closest.value
  } inches. Continue slowly and keep checking mirrors.`;
}

export function getVoiceWarning(level: ClearanceLevel, warningReason: string) {
  if (level === "stop") {
    return `Stop. ${warningReason}`;
  }

  if (level === "caution") {
    return `Caution. ${warningReason}`;
  }

  return `Clearance check. ${warningReason}`;
}
