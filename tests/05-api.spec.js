const { test, expect } = require("@playwright/test");

// NEW IDEA: testing the BACKEND directly, with no browser at all.
// `request` is like a tiny Postman. It sends HTTP calls to the API
// and remembers cookies between calls, so logging in once is enough.

test("todos API refuses requests when not logged in", async ({ request }) => {
  const res = await request.get("/api/todos");
  expect(res.status()).toBe(401);
});

test("login with wrong password is rejected", async ({ request }) => {
  const res = await request.post("/api/login", {
    data: { username: "admin", password: "nope" },
  });
  expect(res.status()).toBe(401);
});

test("full CRUD round trip through the API", async ({ request }) => {
  // log in (the session cookie is kept for the next calls)
  const login = await request.post("/api/login", {
    data: { username: "admin", password: "admin" },
  });
  expect(login.ok()).toBeTruthy();

  // CREATE
  const created = await request.post("/api/todos", { data: { title: "From the API" } });
  expect(created.status()).toBe(201);
  const todo = await created.json();
  expect(todo).toMatchObject({ title: "From the API", done: false });

  // READ (one)
  const read = await request.get(`/api/todos/${todo.id}`);
  expect(read.ok()).toBeTruthy();
  expect((await read.json()).id).toBe(todo.id);

  // UPDATE
  const updated = await request.put(`/api/todos/${todo.id}`, {
    data: { title: "Renamed", done: true },
  });
  expect(updated.ok()).toBeTruthy();
  expect(await updated.json()).toMatchObject({ id: todo.id, title: "Renamed", done: true });

  // READ (all) contains it
  const all = await (await request.get("/api/todos")).json();
  expect(all.some((t) => t.id === todo.id)).toBeTruthy();

  // DELETE
  const deleted = await request.delete(`/api/todos/${todo.id}`);
  expect(deleted.status()).toBe(204);

  // and now it is gone
  const gone = await request.get(`/api/todos/${todo.id}`);
  expect(gone.status()).toBe(404);
});
