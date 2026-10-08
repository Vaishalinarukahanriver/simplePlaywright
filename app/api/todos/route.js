import { getSessionUser, unauthorized } from "@/lib/auth";
import { listTodos, createTodo } from "@/lib/db";

// GET /api/todos  -> all todos
export async function GET() {
  if (!(await getSessionUser())) return unauthorized();
  return Response.json(listTodos());
}

// POST /api/todos  { title }  -> create one
export async function POST(request) {
  if (!(await getSessionUser())) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  return Response.json(createTodo(title), { status: 201 });
}
