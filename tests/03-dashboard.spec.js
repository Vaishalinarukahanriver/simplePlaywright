const { test, expect } = require("@playwright/test");

test("dashboard kicks me out if I am not logged in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
});

test("logout takes me back to the login page", async ({ page }) => {
  // log in first
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL("/dashboard");

  // now click Logout
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL("/login");

  // and prove we are really logged out
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
});
