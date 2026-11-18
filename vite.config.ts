import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "version-offline-cache",
      writeBundle(options, bundle) {
        const buildId = createHash("sha256")
          .update(
            Object.keys(bundle).sort().join("|") +
              readFileSync(resolve("public/characters/manifest.json"), "utf8"),
          )
          .digest("hex")
          .slice(0, 12);
        const file = resolve(options.dir || "dist", "sw.js");
        writeFileSync(
          file,
          readFileSync(file, "utf8").replace("__BUILD_ID__", buildId),
        );
      },
    },
  ],
});
