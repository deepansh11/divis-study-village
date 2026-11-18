import { test } from "node:test";
import assert from "node:assert/strict";
import { nicknameForDay } from "./personalization.ts";
import { GHIBLI_VISITORS, isGhibliId, visitorForDay } from "./ghibli.ts";
import {
  MINI_POSES,
  MINI_SPRITES,
  miniPoseForNote,
  SUPPLIED_GHIBLI_DESIGNS,
} from "./characterAssets.ts";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  addDays,
  badges,
  challengeDates,
  dateKey,
  dayDifference,
  emptyDay,
  finishTimer,
  initialState,
  minutesFor,
  migrateCompanionName,
  pointsFor,
  remainingSeconds,
  stats,
  validateState,
} from "./model.ts";

const setup = () => {
  const s = initialState();
  s.profile.start = "2026-11-01";
  s.profile.timezone = "Asia/Kolkata";
  return s;
};

test("private greetings rotate nicknames by day while respecting the profile name", () => {
  assert.equal(nicknameForDay(0), "Divi");
  assert.equal(nicknameForDay(1), "Babe");
  assert.equal(nicknameForDay(2), "Pyaari Pyaari");
  assert.equal(nicknameForDay(3), "Divi");
  assert.equal(nicknameForDay(-1), "Divi");
  assert.equal(nicknameForDay(2, "Divya"), "Divya");
  assert.equal(nicknameForDay(1), nicknameForDay(1));
});

test("Ghibli visitors rotate calmly, can stay pinned, and have unique valid IDs", () => {
  assert.equal(GHIBLI_VISITORS.length, 22);
  assert.equal(new Set(GHIBLI_VISITORS.map((v) => v.id)).size, 22);
  assert.equal(visitorForDay(0).id, "totoro");
  assert.equal(visitorForDay(1).id, "jiji");
  assert.equal(visitorForDay(22).id, "totoro");
  assert.equal(visitorForDay(17, "calcifer").id, "calcifer");
  assert.equal(visitorForDay(0, "not-a-visitor").id, "totoro");
  assert.equal(isGhibliId("totoro"), true);
  assert.equal(isGhibliId("<script>"), false);
  const s = setup();
  s.profile.visitor = "unknown";
  assert.throws(() => validateState(s));
});

test("supplied artwork assets and registered sprite atlases match their manifest", () => {
  const root = new URL("../public/characters/", import.meta.url);
  const manifest = JSON.parse(
    readFileSync(new URL("manifest.json", root), "utf8"),
  );
  for (const [name, info] of Object.entries(manifest)) {
    const meta = info as {
      width: number;
      height: number;
      bytes: number;
      sha256: string;
      frames?: number;
      frameWidth?: number;
      frameHeight?: number;
    };
    const bytes = readFileSync(new URL(`${name}.webp`, root));
    assert.equal(bytes.length, meta.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), meta.sha256);
    assert.ok(meta.width >= 30 && meta.height >= 30);
    if (meta.frames) assert.equal(meta.width, meta.frames * meta.frameWidth!);
  }
  for (const pose of MINI_POSES) assert.ok(manifest[`mini-${pose}`]);
  for (const id of SUPPLIED_GHIBLI_DESIGNS) assert.ok(manifest[`ghibli-${id}`]);
  for (const pose of Object.keys(MINI_SPRITES))
    assert.ok(manifest[`mini-${pose}-atlas`]);
  assert.equal(miniPoseForNote(0, 0), "heart");
  assert.notEqual(miniPoseForNote(0, 0), miniPoseForNote(0, 1));
});

test("Mylo replaces only the old placeholder and preserves study records", () => {
  assert.equal(initialState().profile.dog, "Mylo");
  const s = setup();
  s.profile.dog = "Your little study buddy";
  s.days[s.profile.start] = {
    ...emptyDay(),
    manualMinutes: 120,
    note: "Keep this reflection",
  };
  const migrated = migrateCompanionName(s);
  assert.equal(migrated.profile.dog, "Mylo");
  assert.equal(migrated.days, s.days);
  assert.equal(migrated.sessions, s.sessions);
  assert.equal(migrated.tests, s.tests);
  assert.equal(s.profile.dog, "Your little study buddy");
  s.profile.dog = "Mylo the magnificent";
  assert.equal(migrateCompanionName(s), s);
});

test("calendar arithmetic crosses month, year and daylight-saving boundaries", () => {
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2026-03-08", 1), "2026-03-09");
  assert.equal(dayDifference("2026-03-09", "2026-03-07"), 2);
  assert.equal(
    dateKey(new Date("2026-11-17T20:00:00Z"), "Asia/Kolkata"),
    "2026-11-18",
  );
  assert.equal(challengeDates(setup()).length, 50);
});
test("manual time and completed focus sessions combine without rounding up", () => {
  const s = setup();
  s.days["2026-11-01"] = { ...emptyDay(), manualMinutes: 60 };
  s.sessions = [{ id: "one", date: "2026-11-01", minutes: 25 }];
  assert.equal(minutesFor(s, "2026-11-01"), 85);
  assert.equal(pointsFor(s, "2026-11-01"), 14);
});
test("habit and task points require actual study time", () => {
  const s = setup();
  s.days["2026-11-01"] = {
    ...emptyDay(),
    tasks: [true, true, true],
    phone: true,
    sleep: true,
  };
  assert.equal(pointsFor(s, "2026-11-01"), 0);
  s.days["2026-11-01"].manualMinutes = 240;
  assert.equal(pointsFor(s, "2026-11-01"), 90);
});
test("today does not prematurely break yesterday’s streak", () => {
  const s = setup();
  for (const date of ["2026-11-01", "2026-11-02"])
    s.days[date] = { ...emptyDay(), manualMinutes: 120 };
  assert.equal(stats(s, "2026-11-03").streak, 2);
  assert.equal(stats(s, "2026-11-04").streak, 0);
  assert.equal(stats(s, "2026-11-04").best, 2);
  assert.equal(stats(s, "2026-11-03").completed, 2);
  assert.equal(stats(s, "2026-11-03").targetDays, 0);
});
test("average includes only nonzero studied days and excludes future logs", () => {
  const s = setup();
  s.days["2026-11-01"] = { ...emptyDay(), manualMinutes: 60 };
  s.days["2026-11-02"] = emptyDay();
  s.days["2026-11-03"] = { ...emptyDay(), manualMinutes: 180 };
  s.days["2026-12-01"] = { ...emptyDay(), manualMinutes: 600 };
  assert.equal(stats(s, "2026-11-03").average, 120);
  assert.equal(stats(s, "2026-11-03").minutes, 240);
});
test("timer reconciles timestamps and remains unchanged while paused", () => {
  const s = setup();
  s.timer.status = "running";
  s.timer.endsAt = 100000;
  assert.equal(remainingSeconds(s.timer, 75000), 25);
  assert.equal(remainingSeconds(s.timer, 105000), 0);
  s.timer.status = "paused";
  s.timer.remaining = 75;
  assert.equal(remainingSeconds(s.timer, 200000), 75);
});
test("completion credits exactly 25 minutes once to session start date", () => {
  const s = setup();
  s.timer.date = "2026-11-01";
  s.timer.status = "running";
  s.timer.endsAt = 1;
  const finished = finishTimer(s, "2026-11-02");
  assert.equal(finished.sessions.length, 1);
  assert.equal(finished.sessions[0].minutes, 25);
  assert.equal(finished.sessions[0].date, "2026-11-01");
  assert.equal(finished.timer.mode, "break");
  const duplicate = finishTimer({ ...finished, timer: s.timer }, "2026-11-02");
  assert.equal(duplicate.sessions.length, 1);
  const afterBreak = finishTimer(finished, "2026-11-02");
  assert.equal(afterBreak.sessions.length, 1);
  assert.equal(afterBreak.timer.mode, "focus");
});
test("badges are derived from real records and react to corrections", () => {
  const s = setup();
  for (let i = 0; i < 7; i++)
    s.days[addDays(s.profile.start, i)] = { ...emptyDay(), manualMinutes: 120 };
  assert.equal(badges(s, "2026-11-07").filter((b) => b.earned).length, 3);
  s.days["2026-11-04"].manualMinutes = 0;
  assert.equal(
    badges(s, "2026-11-07").find((b) => b.name === "A week of wonder")?.earned,
    false,
  );
});
test("backup validation accepts a round trip and rejects unsafe values", () => {
  const s = setup();
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(s))), s);
  assert.throws(() =>
    validateState({ ...s, profile: { ...s.profile, minimum: -1 } }),
  );
  assert.throws(() =>
    validateState({ ...s, days: { "2026-02-31": emptyDay() } }),
  );
  assert.throws(() =>
    validateState({
      ...s,
      sessions: [{ id: "a", minutes: 30, date: "2026-11-01" }],
    }),
  );
  assert.throws(() =>
    validateState({
      ...s,
      timer: { ...s.timer, status: "running", endsAt: null },
    }),
  );
  assert.throws(() =>
    validateState({
      ...s,
      tests: [
        {
          id: "a",
          subject: "Audit",
          date: "2026-11-01",
          marks: 110,
          total: 100,
          kind: "Daily",
        },
      ],
    }),
  );
});
