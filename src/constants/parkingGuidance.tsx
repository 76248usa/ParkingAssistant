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
      title: "Pull forward past the site",
      instruction:
        "Keep the truck and trailer straight. Pull forward until the trailer axle is just past the campsite entrance.",
      voicePrompt:
        "Keep straight. Pull forward past the site until the trailer axle is just past the campsite entrance.",
    },
    {
      title: "Turn wheel and back slowly",
      instruction:
        "Turn the wheel toward the backing side and begin backing very slowly. Watch the trailer start to bend toward the campsite.",
      voicePrompt:
        "Turn the wheel toward the backing side and back slowly. Watch the trailer start to turn.",
    },
    {
      title: "Trailer entering the site",
      instruction:
        "Keep backing slowly until the rear of the trailer starts entering the campsite. Do not over-steer.",
      voicePrompt:
        "The trailer should now start entering the site. Keep backing slowly and avoid over-steering.",
    },
    {
      title: "Follow and straighten",
      instruction:
        "As the trailer enters the site, reduce steering and start straightening the truck so it follows the trailer.",
      voicePrompt:
        "Now reduce steering and follow the trailer. Start straightening the truck as the trailer enters the site.",
    },
    {
      title: "Center in the site",
      instruction:
        "Straighten the wheel and back slowly until the trailer is centered in the campsite.",
      voicePrompt:
        "Straighten the wheel. Back slowly until the trailer is centered in the site.",
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
