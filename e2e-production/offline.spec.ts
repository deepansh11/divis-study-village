import { test, expect } from "@playwright/test";

test("production app and both local fonts work after an offline reload", async ({
  page,
  context,
}) => {
  const failures: string[] = [];
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    await document.fonts.ready;
  });
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.reload({ waitUntil: "networkidle" });
  await context.setOffline(true);
  page.on("requestfailed", (request) => failures.push(request.url()));
  await page.reload({ waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect(
    page.getByRole("heading", { name: "A little better, every day." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.fonts.check('16px "DM Sans"') &&
        document.fonts.check("16px Lora"),
    ),
  ).toBe(true);
  expect(failures).toEqual([]);
  const missingCharacters = await page.evaluate(async () => {
    const manifest = await (await fetch("/characters/manifest.json")).json();
    const results = await Promise.all(
      Object.keys(manifest).map(async (name) =>
        (await caches.match(`/characters/${name}.webp`, { ignoreVary: true }))
          ? null
          : name,
      ),
    );
    return results.filter(Boolean);
  });
  expect(missingCharacters).toEqual([]);
  await page
    .getByRole("button", { name: "Ghibli visitors’ corner", exact: true })
    .click();
  await expect(page.locator(".visitors-grid .supplied-ghibli")).toHaveCount(15);
  await page
    .getByRole("button", { name: "Visit Calcifer", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Keep Calcifer nearby", exact: true })
    .click();
  await page.getByRole("button", { name: "Back to my little day" }).click();
  await page.getByRole("button", { name: "Log my day" }).click();
  await page.getByLabel("Manual study time (hours)").fill("2");
  await page.getByRole("button", { name: "Save my little day" }).click();
  await page.reload({ waitUntil: "load" });
  await expect(page.locator(".large-number")).toHaveText("2h");
});
