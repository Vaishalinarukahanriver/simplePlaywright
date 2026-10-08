// Session handling for the API.
// Login sets an httpOnly cookie; every protected route checks for it.
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";
const USERS = { admin: "admin" };

export function checkCredentials(username, password) {
  return USERS[username] !== undefined && USERS[username] === password;
}

export async function getSessionUser() {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

export function unauthorized() {
  return Response.json({ error: "Not logged in" }, { status: 401 });
}
