import { cookies } from "next/headers";
import { checkCredentials, SESSION_COOKIE } from "@/lib/auth";

// POST /api/login  { username, password }
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body;

  if (!checkCredentials(username, password)) {
    return Response.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return Response.json({ user: username });
}
