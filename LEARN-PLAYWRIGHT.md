# Learn Playwright (explained simply)

## 1. What is Playwright?

Imagine a robot that can open Chrome, type into boxes, click buttons and
then LOOK at the screen to check if the right thing happened.

That robot is Playwright. You write a short list of instructions ("open
the login page, type admin, click Login, check you landed on the
dashboard"). Then you run one command and the robot does it all, every
time, much faster than a human.

Why does your office want it? Every time someone changes code, the robot
re-checks that login, dashboard, logout still work. Nobody has to click
through the whole app by hand after every change.

## 2. The files

```
simple-login/
  playwright.config.js        <- settings: where are the tests, how to start the app
  tests/
    01-first-test.spec.js     <- one tiny test
    02-login.spec.js          <- login page tests
    03-dashboard.spec.js      <- dashboard tests
```

Test files must end in `.spec.js` (or `.spec.ts`). That is how Playwright finds them.

## 3. The shape of every test

```js
const { test, expect } = require("@playwright/test");

test("plain English name of what you are checking", async ({ page }) => {
  await page.goto("/login");              // DO something
  await expect(page).toHaveURL("/login"); // CHECK something
});
```

| Word     | Means                                                      |
|----------|------------------------------------------------------------|
| `test`   | "Here is one thing I want the robot to check."             |
| `page`   | The browser tab the robot is controlling.                  |
| `expect` | "I expect this to be true. If it is not, the test fails."  |
| `await`  | "Wait for this line to finish before going to the next."   |

Browsers are slow, so nearly every line needs `await`.

## 4. DO things (actions)

```js
await page.goto("/login");                                 // open a page
await page.getByLabel("Username").fill("admin");           // type into a box
await page.getByRole("button", { name: "Login" }).click(); // click a button
```

## 5. FIND things (locators)

The robot must find the thing before it can click it. Describe the thing
the way a PERSON would:

| Code                                           | A person would say                   |
|------------------------------------------------|--------------------------------------|
| `page.getByRole("button", { name: "Login" })`  | "the button that says Login"         |
| `page.getByRole("heading", { name: "Login" })` | "the big title that says Login"      |
| `page.getByLabel("Username")`                  | "the box next to the word Username"  |
| `page.getByText("Welcome, admin!")`            | "the text Welcome, admin!"           |

Do NOT find things by CSS class (`.btn-primary`). Designers rename those
all the time and the test breaks for no real reason.

## 6. CHECK things (assertions)

```js
await expect(page).toHaveURL("/dashboard");                    // address bar
await expect(page.getByText("Welcome, admin!")).toBeVisible(); // on screen
```

`expect` WAITS up to 5 seconds for the thing to become true. So you never
write "sleep 2 seconds then check". Playwright handles the waiting.

## 7. Run the tests

```
npm test               # run all, no window (fast, what CI uses)
npm run test:headed    # run and WATCH the browser (best for learning)
npm run test:ui        # a small app where you click tests one by one
```

Try `npm run test:headed` first. Watching the robot type "admin" and
click Login makes the whole idea click.

## 8. Reading a failure

When a test fails, Playwright prints:

```
Expected: "http://localhost:3100/dashboard"
Received: "http://localhost:3100/login"
```

Read the Expected / Received lines first. They almost always tell you the
answer. A screenshot of the broken moment is saved in `test-results/`.

## 9. The config file, line by line

```js
testDir: "./tests",                    // look for *.spec.js here
webServer: {
  command: "npm run dev -- -p 3100",   // start the app on port 3100 first
  url: "http://localhost:3100",        // wait until this answers
  reuseExistingServer: false,          // always start a fresh copy
},
use: {
  baseURL: "http://localhost:3100",    // so goto("/login") works
  screenshot: "only-on-failure",       // save a picture when something breaks
},
```

Why port 3100? Your TalkingClub admin app usually sits on 3000. When the
tests pointed at 3000 they tested THAT app and all six failed. Always know
which app your tests are pointing at.

## 10. Homework

1. Change `"admin"` to `"secret"` in `app/login/page.tsx`, run `npm test`,
   read the failure, fix the test, run again. Then put it back.
2. Add a test that checks the Logout button is visible on the dashboard.
3. Add a test that clicks Login with both boxes empty and checks you stay
   on `/login`.
4. Start the app with `npm run dev -- -p 3100` in one terminal, then in
   another run `npx playwright codegen http://localhost:3100`. Click
   around. Playwright writes the test code for you as you click.
