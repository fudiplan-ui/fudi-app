import { defineConfig } from "vitest/config";

// Eigenständige Vitest-Konfiguration (bewusst OHNE die Figma-Plugins aus
// vite.config.ts, damit Tests nicht vom Dev-Server-Kontext abhängen).
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: false,
  },
});
