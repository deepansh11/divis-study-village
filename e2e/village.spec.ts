import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const KEY = "divi-study-village-v1";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("iPad dashboard is original, empty, and fits portrait and landscape", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { name: /Little steps.*Beautiful things/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Divi’s fluffy cream dog/ }),
  ).toBeVisible();
  await expect(page.locator(".stat-value").first()).toHaveText("0/ 50");
  await expect(page.locator(".day-cell")).toHaveCount(50);
  await expect(page.locator(".dog-name")).toHaveText("Mylo");
  for (const viewport of [
    { width: 1194, height: 834 },
    { width: 834, height: 1194 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
test("daily logging persists, target celebration and private notes work", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Log my day" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Manual study time (hours)").fill("7");
  await dialog.getByRole("button", { name: "Practical", exact: false }).click();
  await dialog.getByRole("button", { name: "Wonderful", exact: false }).click();
  await dialog
    .getByRole("textbox", { name: "Task 1 name" })
    .fill("Revise accounting standards");
  await dialog.getByRole("checkbox", { name: "Task 1 completed" }).check();
  await dialog
    .getByLabel("A little reflection")
    .fill("Private reflection, never for sharing.");
  await dialog.getByRole("button", { name: "Save my little day" }).click();
  await expect(
    page.getByRole("heading", { name: "Your garden bloomed today." }),
  ).toBeVisible();
  await expect(page.locator(".cheering-promise")).toContainText(
    "Me and Mylo will always be cheering for you",
  );
  await expect(
    page.locator('.reward-art .supplied-mini[data-pose="celebrate"]'),
  ).toBeVisible();
  await expect(
    page.locator(
      '.reward-art image[href="/characters/mini-celebrate-atlas.webp"]',
    ),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "Keeping this little win" }).click();
  await page.reload();
  await expect(page.locator(".large-number")).toHaveText("7h");
  await expect(
    page.getByText("Revise accounting standards", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "A small reminder for you" }).click();
  await expect(
    page.getByRole("img", { name: /storybook version of Deepansh/ }),
  ).toBeVisible();
  await expect(page.locator(".love-note blockquote")).toContainText(
    "Pyaari Pyaari",
  );
  await page.getByRole("button", { name: "Another little reminder" }).click();
  await expect(page.locator(".love-note blockquote")).toContainText("Divi");
  await page.getByRole("button", { name: "Another little reminder" }).click();
  await expect(page.locator(".love-note blockquote")).toContainText("Babe");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Share my progress" }).click();
  await expect(
    page.getByRole("img", { name: "Your study journey progress card" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).not.toContainText(
    "Private reflection",
  );
});
test("focus timer pauses across reloads, completes once, and credits 25 minutes", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Let’s focus" }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await page.locator(".timer-digits").innerText();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".timer-digits")).toHaveText(paused);
  await page.evaluate((key) => {
    const s = JSON.parse(localStorage.getItem(key)!);
    s.timer.status = "running";
    s.timer.endsAt = Date.now() - 1000;
    localStorage.setItem(key, JSON.stringify(s));
  }, KEY);
  await page.reload();
  await expect(page.locator(".large-number")).toHaveText("25m");
  await expect(
    page.getByRole("heading", { name: "A well-earned pause" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator(".large-number")).toHaveText("25m");
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).sessions.length,
      KEY,
    ),
  ).toBe(1);
});
test("tests and subject goals can be created, corrected and removed", async ({
  page,
}) => {
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Tests & growth" })
    .click();
  await page.getByRole("button", { name: "Subject", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Subject", { exact: true })
    .fill("Auditing");
  await page.getByLabel("Previous marks / 100").fill("45");
  await page.getByLabel("Goal marks / 100").fill("70");
  await page.getByRole("button", { name: "Plant this little goal" }).click();
  await page.getByRole("button", { name: "Log a test", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Subject", { exact: true })
    .fill("Auditing");
  await page.getByLabel("Marks scored").fill("75");
  await page.getByRole("button", { name: "Save test", exact: true }).click();
  await expect(page.getByText("Goal reached", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Edit Auditing test" }).click();
  await page.getByLabel("Marks scored").fill("68");
  await page.getByRole("button", { name: "Save test", exact: true }).click();
  await expect(page.locator(".test-row")).toContainText("68");
  await page.getByRole("button", { name: "Delete Auditing test" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete test", exact: true })
    .click();
  await expect(page.locator(".test-row")).toHaveCount(0);
});
test("preferences, JSON backup download and validated restore work", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Make it yours" }).click();
  await page.getByRole("textbox", { name: "Your dog’s name" }).fill("Mochi");
  await page.getByRole("button", { name: "Save my preferences" }).click();
  const downloading = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export backup", exact: true })
    .click();
  const download = await downloading;
  expect(download.suggestedFilename()).toMatch(/divi-study-village.*\.json/);
  const state = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    KEY,
  );
  state.profile.dog = "Restored puppy";
  await page.locator("input[type=file]").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(state)),
  });
  await page
    .getByRole("dialog", { name: "Restore this backup?" })
    .getByRole("button", { name: "Restore backup", exact: true })
    .click();
  await expect(page.getByText("Restored puppy", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Restored puppy", { exact: true })).toBeVisible();
});
test("unreadable saved data is not overwritten automatically", async ({
  page,
}) => {
  await page.evaluate((key) => localStorage.setItem(key, "{broken"), KEY);
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "has not been overwritten",
  );
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(
    "{broken",
  );
});

test("main screens and night theme pass automated accessibility checks", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const screen of [
    "My little day",
    "50-day journey",
    "Focus room",
    "Tests & growth",
  ]) {
    await page
      .locator(".sidebar")
      .getByRole("button", { name: screen, exact: true })
      .click();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.allSettled(document.getAnimations().map((a) => a.finished));
    });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  await page.getByRole("button", { name: "Use night theme" }).click();
  await page.evaluate(async () => {
    await Promise.allSettled(document.getAnimations().map((a) => a.finished));
  });
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Ghibli visitors’ corner", exact: true })
    .click();
  const gallery = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    gallery.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("Mylo’s gentle motion can be paused and rests during study or Reduce Motion", async ({
  page,
}) => {
  const tail = page.locator(".companion-card .mylo-sprite-strip");
  await expect(page.locator(".companion-label")).toContainText("MYLO");
  await expect(tail).toHaveCSS("animation-name", "sprite-quiet-six");
  await page
    .getByRole("button", { name: "Pause character animations" })
    .click();
  await expect(tail).toHaveCSS("animation-name", "none");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Enable character animations" }),
  ).toBeVisible();
  await expect(tail).toHaveCSS("animation-name", "none");
  await page
    .getByRole("button", { name: "Enable character animations" })
    .click();
  await page.getByRole("button", { name: "Let’s focus" }).click();
  await expect(tail).toHaveCSS("animation-play-state", "paused");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(tail).toHaveCSS("animation-play-state", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(tail).toHaveCSS("animation-name", "none");
});

test("iPad touch navigation and timer survive Split View and orientation changes", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 600, height: 900 });
  const compact = page.getByRole("navigation", { name: "Compact navigation" });
  await compact.getByRole("button", { name: "Journey", exact: true }).tap();
  await page.locator(".day-cell:not(:disabled)").first().tap();
  await page.getByLabel("Manual study time (hours)").fill("1.5");
  await page.getByRole("button", { name: "Save my little day" }).tap();
  await compact.getByRole("button", { name: "Focus", exact: true }).tap();
  await expect(
    page.getByRole("heading", { name: "Mylo is keeping watch." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Let’s focus" }).tap();
  await page.getByRole("button", { name: "Pause", exact: true }).tap();
  const pausedTime = await page.locator(".timer-digits").innerText();
  await page.screenshot({
    path: testInfo.outputPath("ipad-split-view.png"),
    fullPage: true,
  });
  for (const viewport of [
    { width: 1194, height: 834 },
    { width: 834, height: 1194 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator(".timer-digits")).toHaveText(pausedTime);
    await expect(
      page.getByRole("button", { name: "Continue", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "My little day" })
    .tap();
  await expect(page.locator(".large-number")).toHaveText("1h 30m");
  await page.screenshot({
    path: testInfo.outputPath("ipad-portrait.png"),
    fullPage: true,
  });
});

test("existing placeholder names become Mylo without discarding data", async ({
  page,
}) => {
  const before = await page.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key)!);
    saved.profile.dog = "Your little study buddy";
    localStorage.setItem(key, JSON.stringify(saved));
    return saved;
  }, KEY);
  await page.reload();
  await expect(page.locator(".dog-name")).toHaveText("Mylo");
  const after = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    KEY,
  );
  expect(after).toEqual({
    ...before,
    profile: { ...before.profile, dog: "Mylo" },
  });
});

test("all Ghibli visitors are available, can stay nearby, and remain secondary to Mylo", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Ghibli visitors’ corner", exact: true })
    .tap();
  const dialog = page.getByRole("dialog", { name: "Your little Ghibli-verse" });
  await expect(dialog.locator(".visitor-tile")).toHaveCount(22);
  await expect(dialog.locator(".visitors-grid .supplied-ghibli")).toHaveCount(
    15,
  );
  await dialog
    .getByRole("button", { name: "Visit Calcifer", exact: true })
    .tap();
  await expect(dialog.locator(".visitor-spotlight h3")).toHaveText("Calcifer");
  await dialog
    .getByRole("button", { name: "Keep Calcifer nearby", exact: true })
    .tap();
  await dialog.getByRole("button", { name: "Back to my little day" }).tap();
  await expect(page.locator(".visitor-postcard-copy strong")).toHaveText(
    "Calcifer stopped by.",
  );
  await expect(
    page.getByRole("heading", { name: "Mylo is here for you." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.locator('.visitor-postcard [data-visitor="calcifer"]'),
  ).toBeVisible();
  await page.setViewportSize({ width: 600, height: 900 });
  await page.locator(".visitor-postcard").tap();
  await dialog.getByRole("button", { name: "Let visitors take turns" }).tap();
  await expect(dialog.locator(".visitor-spotlight h3")).toHaveText("Totoro");
  await dialog.getByRole("button", { name: "Visit Haku", exact: true }).tap();
  await dialog
    .getByRole("button", { name: "Keep Haku nearby", exact: true })
    .tap();
  await dialog.getByRole("button", { name: "Back to my little day" }).tap();
  await expect(page.locator(".visitor-postcard-copy strong")).toHaveText(
    "Haku stopped by.",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("provided art decodes with transparency and Mylo advances through real sprite frames", async ({
  page,
}) => {
  const failures = await page.evaluate(async () => {
    const manifest = await (await fetch("/characters/manifest.json")).json();
    const results = await Promise.all(
      Object.entries(manifest).map(async ([name, value]) => {
        const meta = value as { width: number; height: number };
        const image = new Image();
        image.src = `/characters/${name}.webp`;
        try {
          await image.decode();
        } catch {
          return name + ": decode failed";
        }
        if (
          image.naturalWidth !== meta.width ||
          image.naturalHeight !== meta.height
        )
          return name + ": incorrect dimensions";
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(image, 0, 0);
        if (ctx.getImageData(0, 0, 1, 1).data[3] !== 0)
          return name + ": opaque background";
        return null;
      }),
    );
    return results.filter(Boolean);
  });
  expect(failures).toEqual([]);
  const strip = page.locator(".companion-card .mylo-sprite-strip");
  const offset = await strip.evaluate(async (el) => {
    const animation = el.getAnimations()[0];
    animation.pause();
    animation.currentTime = 9000;
    await new Promise(requestAnimationFrame);
    return new DOMMatrix(getComputedStyle(el).transform).m41;
  });
  expect(offset).toBe(-420);
  await page
    .getByRole("button", { name: "Pause character animations" })
    .click();
  await expect(strip).toHaveCSS("animation-name", "none");
  expect(
    await strip.evaluate(
      (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
    ),
  ).toBe(0);
});
