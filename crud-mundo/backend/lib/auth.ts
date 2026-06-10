import jwt from "jsonwebtoken";
import { fail } from "./http";

type Session = { userId: number; email: string };

const secret = process.env.JWT_SECRET;

export function createToken(session: Session) {
  if (!secret) throw new Error("JWT_SECRET nao configurado");
  return jwt.sign(session, secret, { expiresIn: "8h" });
}

export function requireSession(request: Request): Session | Response {
  if (!secret) return fail("JWT_SECRET nao configurado.", 500);
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return fail("Nao autorizado.", 401);

  try {
    return jwt.verify(header.slice(7), secret) as Session;
  } catch {
    return fail("Sessao invalida ou expirada.", 401);
  }
}

