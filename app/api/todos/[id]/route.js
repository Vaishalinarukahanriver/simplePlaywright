import { getSessionUser, unauthorized } from "@/lib/auth";
import { getTodo, updateTodo, deleteTodo } from "@/lib/db";

async function parseId(params) {
  const { id } = await params;
  const n = Number(id);
  return Number.isInteger(n) ? n : null;
}

function notFound() {
  return Response.json({ error: "Todo not found" }, { status: 404 });
}

// GET /api/todos/:id
export async function GET(_request, { params }) {
  if (!(await getSessionUser())) return unauthorized();
  const id = await parseId(params);
  const todo = id === null ? null : getTodo(id);
  return todo ? Response.json(todo) : notFound();
}

// PUT /api/todos/:id  { title?, done? }
export async function PUT(request, { params }) {
  if (!(await getSessionUser())) return unauthorized();
  const id = await parseId(params);
  if (id === null) return notFound();

  const body = await request.json().catch(() => ({}));
  if (typeof body.title === "string" && body.title.trim() === "") {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }
  const changes = {};
  if (typeof body.title === "string") changes.title = body.title.trim();
  if (typeof body.done === "boolean") changes.done = body.done;

  const todo = updateTodo(id, changes);
  return todo ? Response.json(todo) : notFound();
}

// DELETE /api/todos/:id
export async function DELETE(_request, { params }) {
  if (!(await getSessionUser())) return unauthorized();
  const id = await parseId(params);
  if (id === null || !deleteTodo(id)) return notFound();
  return new Response(null, { status: 204 });
}
