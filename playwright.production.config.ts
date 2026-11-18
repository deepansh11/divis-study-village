import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e-production",
  outputDir: "./test-results/offline",
  use: {
    baseURL: "http://127.0.0.1:4175",
    ...devices["iPad Pro 11"],
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium-offline", use: { browserName: "chromium" } },
    { name: "webkit-offline", use: { browserName: "webkit" } },
  ],
  webServer: {
    command: "npm run preview -- --port 4175 --strictPort",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: !process.env.CI,
  },
});
