// Every test file starts with this line. It gives you two tools:
//   test   -> "here is one thing to check"
//   expect -> "I expect this to be true"
const { test, expect } = require("@playwright/test");

// A test has a NAME (plain English) and a FUNCTION (the steps).
// `page` is the browser tab the robot controls.
// `await` means "wait for this line to finish before moving on".
test("home page sends me to the login page", async ({ page }) => {
  await page.goto("/");                    // DO: open the website
  await expect(page).toHaveURL("/login");  // CHECK: the address bar now says /login
});
