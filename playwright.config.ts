import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results/browser",
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:5174",
    ...devices["iPad Pro 11"],
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium-ipad", use: { browserName: "chromium" } },
    { name: "webkit-ipad", use: { browserName: "webkit" } },
    {
      name: "webkit-ipad-landscape",
      use: { browserName: "webkit", viewport: { width: 1194, height: 834 } },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 5174 --strictPort",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: !process.env.CI,
  },
});
