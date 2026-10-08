const { test, expect } = require("@playwright/test");

// NEW IDEA: a helper. Every test here needs to be logged in first,
// so we write the login steps once and call them at the top of each test.
async function login(page) {
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL("/dashboard");
}

// NEW IDEA: a unique name per test run, so tests running at the same
// time do not trip over each other. Each test gets its own todo.
function uniqueTitle(label) {
  return `${label} ${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
}

test("dashboard shows the seeded todos", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible();
  await expect(page.getByText("Learn Playwright")).toBeVisible();
});

test("I can add a todo (CREATE)", async ({ page }) => {
  await login(page);
  const title = uniqueTitle("Buy milk");

  await page.getByLabel("New todo").fill(title);
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByText(title)).toBeVisible();
  await expect(page.getByLabel("New todo")).toHaveValue(""); // box was cleared
});

test("empty todo shows an error", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText("Title is required")).toBeVisible();
});

test("I can tick a todo as done (UPDATE)", async ({ page }) => {
  await login(page);
  const title = uniqueTitle("Tick me");
  await page.getByLabel("New todo").fill(title);
  await page.getByRole("button", { name: "Add" }).click();

  // NEW IDEA: getByRole("listitem") + filter -> "the list row that contains this text"
  const row = page.getByRole("listitem").filter({ hasText: title });
  await row.getByRole("checkbox").check();
  await expect(row.getByRole("checkbox")).toBeChecked();
});

test("I can rename a todo (UPDATE)", async ({ page }) => {
  await login(page);
  const title = uniqueTitle("Old name");
  const newTitle = uniqueTitle("New name");
  await page.getByLabel("New todo").fill(title);
  await page.getByRole("button", { name: "Add" }).click();

  const row = page.getByRole("listitem").filter({ hasText: title });
  await row.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Edit title").fill(newTitle);
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText(newTitle)).toBeVisible();
  await expect(page.getByText(title)).toHaveCount(0);
});

test("I can delete a todo (DELETE)", async ({ page }) => {
  await login(page);
  const title = uniqueTitle("Delete me");
  await page.getByLabel("New todo").fill(title);
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText(title)).toBeVisible();

  const row = page.getByRole("listitem").filter({ hasText: title });
  await row.getByRole("button", { name: "Delete" }).click();

  await expect(page.getByText(title)).toHaveCount(0);
});
