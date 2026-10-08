// A tiny in-memory "database".
// It lives on globalThis so it survives Next.js hot reloads in dev,
// and it resets every time the server restarts (nice for tests).

function createStore() {
  return {
    nextId: 3,
    todos: [
      { id: 1, title: "Learn Playwright", done: false },
      { id: 2, title: "Write a CRUD test", done: false },
    ],
  };
}

const store = globalThis.__simpleDb ?? (globalThis.__simpleDb = createStore());

export function listTodos() {
  return store.todos;
}

export function getTodo(id) {
  return store.todos.find((t) => t.id === id) ?? null;
}

export function createTodo(title) {
  const todo = { id: store.nextId++, title, done: false };
  store.todos.push(todo);
  return todo;
}

export function updateTodo(id, changes) {
  const todo = getTodo(id);
  if (!todo) return null;
  if (typeof changes.title === "string") todo.title = changes.title;
  if (typeof changes.done === "boolean") todo.done = changes.done;
  return todo;
}

export function deleteTodo(id) {
  const index = store.todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  store.todos.splice(index, 1);
  return true;
}
