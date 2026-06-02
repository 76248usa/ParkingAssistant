export type ParkingType = "back-in" | "driveway" | "campsite" | "pull-through";

export const parkingTypes: { label: string; value: ParkingType }[] = [
  { label: "Back-in campsite", value: "back-in" },
  { label: "Driveway", value: "driveway" },
  { label: "Campground site", value: "campsite" },
  { label: "Pull-through", value: "pull-through" },
];
export type GuidanceStep = {
  title: string;
  instruction: string;
  warning?: string;
  voicePrompt?: string;
};

export const guidanceByType: Record<ParkingType, GuidanceStep[]> = {
  "back-in": [
    {
      title: "Start wide and slow",
      instruction:
        "Pull slightly past the campsite opening so the trailer axle is near the front edge of the space.",
      warning: "Use a spotter if the site is narrow or has trees/posts.",
      voicePrompt: "Keep straight. Pull forward past the site.",
    },
    {
      title: "Begin backing slowly",
      instruction:
        "Start backing at idle speed. Watch the trailer angle, not just the truck angle.",
      voicePrompt: "Turn left. Back slowly.",
    },
    {
      title: "Follow the trailer",
      instruction:
        "Once the trailer starts entering the space, turn the wheel back to follow the trailer and avoid jackknifing.",
      voicePrompt: "Follow the trailer.",
    },
    {
      title: "Straighten early",
      instruction:
        "When the trailer is mostly aligned, straighten the truck sooner than you think.",
      voicePrompt: "Straighten the wheel.",
    },
    {
      title: "Stop and check clearance",
      instruction:
        "Stop before the final few feet. Check rear clearance, hookups, trees, slide-outs, and overhead branches.",
      warning: "Final clearance check is required before continuing.",
      voicePrompt: "Stop. Check clearance.",
    },
  ],
  driveway: [
    {
      title: "Set up your angle",
      instruction:
        "Pull forward past the driveway and angle the truck so the trailer can enter without cutting the corner.",
      warning: "Watch mailbox, curb, ditch, fence, and rear swing clearance.",
      voicePrompt: "Set up your backing angle.",
    },
    {
      title: "Back slowly into the opening",
      instruction:
        "Begin backing and let the trailer move toward the driveway entrance.",
      voicePrompt: "Back slowly.",
    },
    {
      title: "Correct in small movements",
      instruction:
        "Use small steering corrections. Big corrections can quickly over-angle the trailer.",
      voicePrompt: "Small steering corrections.",
    },
    {
      title: "Stop before the tight point",
      instruction:
        "Pause when the trailer is halfway into the driveway and confirm both sides are clear.",
      voicePrompt: "Stop and check both sides.",
    },
  ],
  campsite: [
    {
      title: "Check obstacles first",
      instruction:
        "Walk the site before backing. Look for hookups, trees, picnic tables, posts, and low branches.",
      warning: "Stop often and re-check slide-out clearance.",
      voicePrompt: "Check the site for obstacles.",
    },
    {
      title: "Choose your target line",
      instruction:
        "Pick a visual line where you want the trailer wheels to track.",
      voicePrompt: "Choose your target line.",
    },
    {
      title: "Back onto the target line",
      instruction:
        "Move slowly and keep the trailer wheels near your target line.",
      voicePrompt: "Follow your target line.",
    },
    {
      title: "Final campsite check",
      instruction:
        "Before parking fully, confirm space for slide-outs, stairs, hookups, and walking clearance.",
      voicePrompt: "Final campsite clearance check.",
    },
  ],
  "pull-through": [
    {
      title: "Line up straight",
      instruction:
        "Approach slowly and keep the truck and trailer as straight as possible.",
      warning: "Do not cut the turn early with a long trailer.",
      voicePrompt: "Keep the rig straight.",
    },
    {
      title: "Watch rear swing",
      instruction:
        "As the truck enters, watch the rear trailer corner and leave clearance around posts and hookups.",
      voicePrompt: "Watch the rear swing.",
    },
    {
      title: "Center the trailer",
      instruction:
        "Stop when the trailer is centered in the space and the doors or slide-outs have room.",
      voicePrompt: "Center the trailer.",
    },
  ],
};
