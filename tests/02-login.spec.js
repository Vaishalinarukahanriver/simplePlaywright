const { test, expect } = require("@playwright/test");

// NEW IDEA: finding things on the page ("locators").
// Describe the thing the way a person would:
//   getByRole("button", { name: "Login" })  -> "the button that says Login"
//   getByLabel("Username")                  -> "the box next to the word Username"
//   getByText("Hint: admin / admin")        -> "the text that says Hint: admin / admin"

test("login page shows the form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByText("Hint: admin / admin")).toBeVisible();
});

// NEW IDEA: actions. fill() types into a box, click() presses a button.
test("wrong password shows an error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("wrong");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Invalid username or password")).toBeVisible();
  await expect(page).toHaveURL("/login"); // we did NOT move anywhere
});

test("correct password takes me to the dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByText("Welcome, admin!")).toBeVisible();
});
