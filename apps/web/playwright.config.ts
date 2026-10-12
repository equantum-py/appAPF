import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", timeout: 30000, workers: 1,
  use: { baseURL: "http://127.0.0.1:13000", trace: "off", screenshot: "off" },
  reporter: [["list"], ["junit", { outputFile: "../../ci-evidence/auth-browser.xml" }]],
});
