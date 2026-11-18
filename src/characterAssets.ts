export const MINI_POSES = [
  "wave",
  "reading",
  "heart",
  "peek",
  "thumbs-up",
  "shrug",
  "tea",
  "celebrate",
  "laptop",
  "sleepy",
  "flex",
  "watering",
  "kiss",
] as const;
export type MiniPose = (typeof MINI_POSES)[number];
export const MINI_SPRITES: Partial<
  Record<
    MiniPose,
    {
      width: number;
      height: number;
      frames: number;
      still?: number;
      once?: boolean;
    }
  >
> = {
  celebrate: { width: 190, height: 300, frames: 6, still: 3, once: true },
  laptop: { width: 190, height: 300, frames: 5 },
  watering: { width: 240, height: 300, frames: 5 },
  tea: { width: 190, height: 300, frames: 5 },
  reading: { width: 190, height: 300, frames: 5 },
  kiss: { width: 190, height: 300, frames: 5 },
};
export const MINI_POSE_LABELS: Record<MiniPose, string> = {
  wave: "shirtless with tattoos, waving hello",
  reading: "wearing a cozy jacket and reading a book",
  heart: "shirtless with tattoos and white shorts, holding a heart",
  peek: "peeking over a little ledge",
  "thumbs-up": "shirtless with tattoos, giving an encouraging thumbs-up",
  shrug: "shirtless with tattoos, offering a gentle shrug",
  tea: "shirtless with tattoos, sitting with a warm cup of tea",
  celebrate:
    "shirtless with tattoos and white shorts, cheering with both arms raised",
  laptop: "wearing a cozy hoodie and working on a laptop",
  sleepy: "shirtless with tattoos, looking sleepy and ready for rest",
  flex: "wearing a tank top, flexing and smiling",
  watering: "shirtless with tattoos, watering a tiny plant",
  kiss: "shirtless with tattoos, blowing a little heart-shaped kiss",
};
export const MINI_NOTE_POSES: readonly (readonly MiniPose[])[] = [
  ["heart", "wave", "peek"],
  ["thumbs-up", "flex", "laptop"],
  ["kiss", "heart", "celebrate"],
  ["tea", "sleepy", "reading"],
  ["watering", "shrug", "wave"],
];
export function miniPoseForNote(note: number, dayIndex: number): MiniPose {
  const choices =
    MINI_NOTE_POSES[Math.max(0, Math.floor(note)) % MINI_NOTE_POSES.length];
  return choices[Math.max(0, Math.floor(dayIndex)) % choices.length];
}
export const SUPPLIED_GHIBLI_DESIGNS = [
  "totoro",
  "blue-totoro",
  "white-totoro",
  "soot-sprites",
  "catbus",
  "kiki",
  "jiji",
  "san",
  "kodama",
  "howl",
  "calcifer",
  "no-face",
  "haku",
  "ponyo",
  "turnip-head",
] as const;
