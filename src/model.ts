import { isGhibliId } from "./ghibli.ts";

export type Day = {
  manualMinutes: number;
  tasks: [boolean, boolean, boolean];
  taskNames: [string, string, string];
  types: string[];
  subject: string;
  mood: string;
  phone: boolean;
  sleep: boolean;
  note: string;
};
export type StudyTest = {
  id: string;
  date: string;
  subject: string;
  kind: string;
  marks: number;
  total: number;
};
export type Goal = {
  id: string;
  subject: string;
  previous: number;
  target: number;
};
export type Session = { id: string; date: string; minutes: number };
export type Timer = {
  id: string;
  mode: "focus" | "break";
  status: "idle" | "running" | "paused";
  remaining: number;
  endsAt: number | null;
  date: string;
};
export type State = {
  version: 1;
  profile: {
    name: string;
    dog: string;
    start: string;
    target: number;
    minimum: number;
    exam: string;
    timezone: string;
    theme: "light" | "dark";
    sound: boolean;
    animations?: boolean;
    visitor?: string;
  };
  days: Record<string, Day>;
  tests: StudyTest[];
  goals: Goal[];
  sessions: Session[];
  timer: Timer;
};
export const KEY = "divi-study-village-v1";
export const uid = () => crypto.randomUUID();
export function dateKey(
  now = new Date(),
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((k) => parts.find((p) => p.type === k)!.value)
    .join("-");
}
export function addDays(date: string, count: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + count);
  return d.toISOString().slice(0, 10);
}
export function dayDifference(a: string, b: string) {
  return Math.round(
    (Date.parse(`${a}T12:00:00Z`) - Date.parse(`${b}T12:00:00Z`)) / 86400000,
  );
}
export function displayDate(
  date: string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    ...options,
    timeZone: "UTC",
  });
}
export function emptyDay(): Day {
  return {
    manualMinutes: 0,
    tasks: [false, false, false],
    taskNames: ["", "", ""],
    types: [],
    subject: "",
    mood: "",
    phone: false,
    sleep: false,
    note: "",
  };
}
export function freshTimer(date: string, mode: Timer["mode"] = "focus"): Timer {
  return {
    id: uid(),
    mode,
    status: "idle",
    remaining: mode === "focus" ? 1500 : 300,
    endsAt: null,
    date,
  };
}
export function initialState(): State {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = dateKey(new Date(), timezone);
  return {
    version: 1,
    profile: {
      name: "Divi",
      dog: "Mylo",
      start: today,
      target: 420,
      minimum: 120,
      exam: "",
      timezone,
      theme: "light",
      sound: false,
      animations: true,
    },
    days: {},
    tests: [],
    goals: [],
    sessions: [],
    timer: freshTimer(today),
  };
}
export function minutesFor(s: State, date: string) {
  return (
    (s.days[date]?.manualMinutes || 0) +
    s.sessions.filter((x) => x.date === date).reduce((a, x) => a + x.minutes, 0)
  );
}
// Update the first preview's placeholder without touching a chosen name or logs.
export function migrateCompanionName(s: State): State {
  return s.profile.dog === "Your little study buddy" || !s.profile.dog.trim()
    ? { ...s, profile: { ...s.profile, dog: "Mylo" } }
    : s;
}
export function pointsFor(s: State, date: string) {
  const minutes = minutesFor(s, date),
    day = s.days[date] || emptyDay();
  return minutes
    ? Math.round(minutes / 6) +
        day.tasks.filter(Boolean).length * 10 +
        (day.phone ? 10 : 0) +
        (day.sleep ? 10 : 0)
    : 0;
}
export function challengeDates(s: State) {
  return Array.from({ length: 50 }, (_, i) => addDays(s.profile.start, i));
}
export function stats(
  s: State,
  today = dateKey(new Date(), s.profile.timezone),
) {
  const dates = challengeDates(s).filter((d) => d <= today);
  let best = 0,
    run = 0;
  for (const date of dates) {
    run = minutesFor(s, date) >= s.profile.minimum ? run + 1 : 0;
    best = Math.max(best, run);
  }
  let index = dates.length - 1;
  if (dates[index] === today && minutesFor(s, today) < s.profile.minimum)
    index--;
  let streak = 0;
  while (index >= 0 && minutesFor(s, dates[index]) >= s.profile.minimum) {
    streak++;
    index--;
  }
  const logged = dates.filter((d) => minutesFor(s, d) > 0);
  const minutes = dates.reduce((a, d) => a + minutesFor(s, d), 0);
  const points = dates.reduce((a, d) => a + pointsFor(s, d), 0);
  return {
    completed: dates.filter((d) => minutesFor(s, d) >= s.profile.minimum)
      .length,
    best,
    streak,
    minutes,
    points,
    logged: logged.length,
    average: logged.length ? minutes / logged.length : 0,
    targetDays: dates.filter((d) => minutesFor(s, d) >= s.profile.target)
      .length,
  };
}
export const LEVELS = [
  { at: 0, name: "Little seedling", icon: "🌱" },
  { at: 150, name: "Finding your rhythm", icon: "🌿" },
  { at: 400, name: "Garden keeper", icon: "🌼" },
  { at: 800, name: "Quietly unstoppable", icon: "🍃" },
  { at: 1300, name: "Dream chaser", icon: "🌸" },
  { at: 2000, name: "Village star", icon: "✨" },
  { at: 3000, name: "CA in bloom", icon: "🎓" },
];
export function levelFor(points: number) {
  return LEVELS.filter((x) => x.at <= points).at(-1)!;
}
export function badges(s: State, today?: string) {
  const st = stats(s, today),
    dates = challengeDates(s).filter(
      (d) => d <= (today || dateKey(new Date(), s.profile.timezone)),
    );
  return [
    {
      icon: "🌱",
      name: "A little beginning",
      detail: "Log your first study minutes",
      earned: st.logged > 0,
    },
    ...[3, 7, 21, 35, 50].map((n, i) => ({
      icon: ["🌼", "🍙", "🌸", "🏮", "🎓"][i],
      name: [
        `First blooms`,
        "A week of wonder",
        "Rooted in routine",
        "Almost in bloom",
        "Your beautiful fifty",
      ][i],
      detail: `${n}-day best streak`,
      earned: st.best >= n,
    })),
    {
      icon: "🍵",
      name: "A hundred little hours",
      detail: "Study for 100 hours",
      earned: st.minutes >= 6000,
    },
    {
      icon: "⭐",
      name: "Five golden days",
      detail: "Earn 150 points on five days",
      earned: dates.filter((d) => pointsFor(s, d) >= 150).length >= 5,
    },
    {
      icon: "🦋",
      name: "Present, not scrolling",
      detail: "10 studied days with phone away",
      earned:
        dates.filter((d) => minutesFor(s, d) > 0 && s.days[d]?.phone).length >=
        10,
    },
    {
      icon: "🌙",
      name: "Rest is productive",
      detail: "10 studied days with sleep protected",
      earned:
        dates.filter((d) => minutesFor(s, d) > 0 && s.days[d]?.sleep).length >=
        10,
    },
    {
      icon: "💛",
      name: "Made of little wins",
      detail: "Earn 1,000 points",
      earned: st.points >= 1000,
    },
  ];
}
export function remainingSeconds(timer: Timer, now: number) {
  return timer.status === "running" && timer.endsAt !== null
    ? Math.max(0, Math.ceil((timer.endsAt - now) / 1000))
    : timer.remaining;
}
export function finishTimer(s: State, today: string): State {
  const t = s.timer;
  return {
    ...s,
    sessions:
      t.mode === "focus" && !s.sessions.some((x) => x.id === t.id)
        ? [...s.sessions, { id: t.id, date: t.date, minutes: 25 }]
        : s.sessions,
    timer: freshTimer(today, t.mode === "focus" ? "break" : "focus"),
  };
}
export function formatMinutes(minutes: number) {
  const m = Math.round(minutes);
  return m < 60
    ? `${m}m`
    : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}`;
}
export function percent(test: StudyTest) {
  return (test.marks / test.total) * 100;
}

const validDate = (s: unknown): s is string =>
  typeof s === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  Number.isFinite(Date.parse(s)) &&
  new Date(`${s}T12:00:00Z`).toISOString().slice(0, 10) === s;
const text = (s: unknown, length: number): s is string =>
  typeof s === "string" && s.length <= length;
const num = (v: unknown, max: number, min = 0): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
export function validateState(value: unknown): State {
  if (!value || typeof value !== "object")
    throw new Error("This is not a Study Village backup.");
  const s = value as State,
    p = s.profile;
  if (
    s.version !== 1 ||
    !p ||
    !text(p.name, 40) ||
    !text(p.dog, 60) ||
    !text(p.timezone, 100) ||
    !p.timezone ||
    !validDate(p.start) ||
    (p.exam !== "" && !validDate(p.exam)) ||
    !num(p.target, 1440, 15) ||
    !num(p.minimum, 1440, 15) ||
    !["light", "dark"].includes(p.theme) ||
    typeof p.sound !== "boolean" ||
    (p.animations !== undefined && typeof p.animations !== "boolean") ||
    (p.visitor !== undefined && !isGhibliId(p.visitor))
  )
    throw new Error("Invalid profile in backup.");
  try {
    new Intl.DateTimeFormat("en", { timeZone: p.timezone }).format();
  } catch {
    throw new Error("Invalid timezone in backup.");
  }
  if (
    !s.days ||
    typeof s.days !== "object" ||
    Array.isArray(s.days) ||
    Object.keys(s.days).length > 10000
  )
    throw new Error("Invalid daily records.");
  for (const [date, d] of Object.entries(s.days)) {
    if (
      !validDate(date) ||
      !d ||
      !num(d.manualMinutes, 1440) ||
      !Array.isArray(d.tasks) ||
      d.tasks.length !== 3 ||
      !d.tasks.every((x) => typeof x === "boolean") ||
      !Array.isArray(d.taskNames) ||
      d.taskNames.length !== 3 ||
      !d.taskNames.every((x) => text(x, 100)) ||
      !Array.isArray(d.types) ||
      !d.types.every((x) => ["Practical", "Theory"].includes(x)) ||
      !text(d.subject, 60) ||
      !text(d.note, 200) ||
      !text(d.mood, 12) ||
      typeof d.phone !== "boolean" ||
      typeof d.sleep !== "boolean"
    )
      throw new Error("Invalid daily record in backup.");
  }
  if (
    !Array.isArray(s.tests) ||
    s.tests.length > 10000 ||
    !s.tests.every(
      (t) =>
        t &&
        text(t.id, 100) &&
        validDate(t.date) &&
        text(t.subject, 60) &&
        ["Daily", "Chapter", "Mock"].includes(t.kind) &&
        num(t.total, 10000, 1) &&
        num(t.marks, t.total),
    )
  )
    throw new Error("Invalid test records.");
  if (
    !Array.isArray(s.goals) ||
    s.goals.length > 1000 ||
    !s.goals.every(
      (g) =>
        g &&
        text(g.id, 100) &&
        text(g.subject, 60) &&
        num(g.previous, 100) &&
        num(g.target, 100),
    )
  )
    throw new Error("Invalid subject goals.");
  if (
    !Array.isArray(s.sessions) ||
    s.sessions.length > 100000 ||
    !s.sessions.every(
      (x) => x && text(x.id, 100) && validDate(x.date) && x.minutes === 25,
    ) ||
    new Set(s.sessions.map((x) => x.id)).size !== s.sessions.length
  )
    throw new Error("Invalid focus sessions.");
  const t = s.timer;
  if (
    !t ||
    !text(t.id, 100) ||
    !["focus", "break"].includes(t.mode) ||
    !["idle", "running", "paused"].includes(t.status) ||
    !num(t.remaining, t.mode === "focus" ? 1500 : 300) ||
    !validDate(t.date) ||
    (t.status === "running" ? !num(t.endsAt, 9e15, 1) : t.endsAt !== null)
  )
    throw new Error("Invalid timer state.");
  return s;
}
