import { getSessionUser, unauthorized } from "@/lib/auth";

// GET /api/me  -> who is logged in?
export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  return Response.json({ user });
}
