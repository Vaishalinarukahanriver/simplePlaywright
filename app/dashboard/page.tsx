"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Todo = { id: number; title: string; done: boolean };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");

  async function loadTodos() {
    const res = await fetch("/api/todos");
    if (res.ok) setTodos(await res.json());
  }

  // On first render: check the session, then load todos.
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setUser(data.user);
      await loadTodos();
    })();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  // CREATE
  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not add todo");
      return;
    }
    setNewTitle("");
    await loadTodos();
  }

  // UPDATE (toggle done)
  async function handleToggle(todo: Todo) {
    const done = !todo.done;
    // Show the change right away, then tell the backend.
    setTodos((list) => list.map((t) => (t.id === todo.id ? { ...t, done } : t)));
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    await loadTodos();
  }

  // UPDATE (rename)
  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    await fetch(`/api/todos/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditingId(null);
    await loadTodos();
  }

  // DELETE
  async function handleDelete(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    await loadTodos();
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user}! You are logged in.</p>
      <button onClick={handleLogout}>Logout</button>

      <h2>Todos</h2>
      <form onSubmit={handleAdd}>
        <label>
          New todo{" "}
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        </label>{" "}
        <button type="submit">Add</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} style={{ marginTop: 8 }}>
              {editingId === todo.id ? (
                <form onSubmit={handleSaveEdit} style={{ display: "inline" }}>
                  <input
                    aria-label="Edit title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />{" "}
                  <button type="submit">Save</button>{" "}
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => handleToggle(todo)}
                    />{" "}
                    <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
                      {todo.title}
                    </span>
                  </label>{" "}
                  <button onClick={() => startEdit(todo)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
