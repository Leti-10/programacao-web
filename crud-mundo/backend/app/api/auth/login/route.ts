import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { fail, handleError, ok } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();
    const result = await pool.query("SELECT id, nome, email, senha FROM usuario WHERE email = LOWER($1)", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(senha ?? "", user.senha))) {
      return fail("Email ou senha invalidos.", 401);
    }
    return ok({
      user: { id: user.id, nome: user.nome, email: user.email },
      token: createToken({ userId: user.id, email: user.email }),
    });
  } catch (error) {
    return handleError(error);
  }
}

