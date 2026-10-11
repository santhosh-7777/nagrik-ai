import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/jwt";

export async function getAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.role === "admin" ? payload : null;
}