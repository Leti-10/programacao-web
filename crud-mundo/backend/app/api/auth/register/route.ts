import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { fail, handleError, ok } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();
    if (!nome || !email || !senha || senha.length < 6) {
      return fail("Informe nome, email e uma senha com pelo menos 6 caracteres.");
    }
    const hash = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO usuario (nome, email, senha) VALUES ($1, LOWER($2), $3) RETURNING id, nome, email",
      [nome.trim(), email.trim(), hash],
    );
    const user = result.rows[0];
    return ok({ user, token: createToken({ userId: user.id, email: user.email }) }, 201);
  } catch (error) {
    return handleError(error);
  }
}

