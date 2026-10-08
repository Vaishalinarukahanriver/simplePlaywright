// This file is the SETTINGS for Playwright. It answers two questions:
//   1. Where are my test files?
//   2. How do I start the app so the tests have something to click on?
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  // 1. Test files live in this folder (any file ending in .spec.js)
  testDir: "./tests",

  // 2. Before testing, start the Next.js app on port 3100.
  //    Playwright waits until the URL answers, runs the tests, then stops the app.
  webServer: {
    command: "npm run dev -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
  },

  use: {
    // So tests can say page.goto("/login") instead of the full address
    baseURL: "http://localhost:3100",
    // Save a picture of the screen when a test fails
    screenshot: "only-on-failure",
  },
});
