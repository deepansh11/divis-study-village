export const PRIVATE_NICKNAMES = ["Divi", "Babe", "Pyaari Pyaari"] as const;

/** A calm daily rotation, never random on a timer tick or screen redraw. */
export function nicknameForDay(dayIndex: number, profileName = "Divi") {
  if (profileName !== "Divi") return profileName;
  return PRIVATE_NICKNAMES[
    Math.max(0, Math.floor(dayIndex)) % PRIVATE_NICKNAMES.length
  ];
}
